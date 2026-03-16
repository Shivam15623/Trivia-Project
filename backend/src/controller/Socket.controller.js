import { getNextQuestionSolo } from "../helper/getNextQuestion.js";
import { getQuestionFromPool } from "../helper/getQuestionFromPool.js";
import { io } from "../index.js";
import { GameAnalytics } from "../model/gameAnalytics.model.js";
import { GameSession } from "../model/GameSession.model.js";
import Question from "../model/questionAnswer.model.js";
import { PlayerStats } from "../model/userStats.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-LEVEL STATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sessionCode → { timeout: NodeJS.Timeout | null, generation: number }
 *
 * `generation` is a monotonically-increasing integer. Every time we arm a new
 * timer for a session we bump it. The timeout callback captures its own
 * generation at arm-time and bails out if the stored generation has moved on.
 *
 * This is the primary race-condition firewall.
 * clearTimeout alone is NOT enough — a callback already queued by the event
 * loop will still fire after clearTimeout in the same tick. The generation
 * check makes every orphaned callback a silent no-op.
 */
const activeTimers = new Map();

/**
 * sessionCode → boolean
 *
 * Async mutex. Held for the duration of the player-ready async handler.
 * A second player-ready that arrives while the first is still awaiting DB
 * calls is dropped immediately, preventing duplicate timer arms.
 */
const processingLock = new Map();

/**
 * socketId → one-way latency in ms
 *
 * Measured once per connection via ping/pong round-trip.
 * Added as a buffer to the server timeout so the client's visual countdown
 * always reaches zero before the server cuts the question.
 */
const playerLatency = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// PURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Canonical wire-format for a question payload.
 * Centralising this prevents field-name drift across emit sites.
 */
function formatQuestion(question) {
  return {
    questionId: question._id,
    points: question.points,
    questionImage: question.questionImage,
    questionText: question.questionText,
    answerImage: question.answerImage,
    options: question.options,
    Answer: question.answer,
    category: {
      id: question.categoryId._id,
      name: question.categoryId.name,
      thumbnail: question.categoryId.thumbnail,
    },
  };
}

/**
 * Cancel the server timeout for a session and bump the generation so any
 * already-queued callback is a no-op when it fires.
 * Safe to call when no timer is armed.
 */
export function cancelTimer(sessionCode) {
  const entry = activeTimers.get(sessionCode);
  if (!entry) return;

  if (entry.timeout) clearTimeout(entry.timeout);

  // Keep the entry with a bumped generation — stale callbacks capture the old
  // generation and will fail the guard check.
  activeTimers.set(sessionCode, {
    timeout: null,
    generation: entry.generation + 1,
  });

  console.log(
    `[timer] cancelled  session=${sessionCode}  new-gen=${entry.generation + 1}`,
  );
}

/**
 * Write a GameAnalytics document for a completed session.
 * Errors are swallowed so analytics failure never breaks the game-ended path.
 */
async function recordAnalytics(session) {
  try {
    const attempts = session.soloPlayer.attemptHistory;
    const totalQuestionsPlayed = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const averageScore =
      totalQuestionsPlayed > 0 ? correctCount / totalQuestionsPlayed : 0;

    await GameAnalytics.create({
      sessionId: session._id,
      host: session.host,
      mode: session.mode,
      categories: session.categories,
      players: [session.soloPlayer.userId],
      playersCount: 1,
      totalQuestionsPlayed,
      averageScore,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    });
    const playerId = session.soloPlayer.userId;
    const score = session.soloPlayer.score;
    const mode = session.mode;

    const WIN_THRESHOLD = 4680;
    const isWin = score >= WIN_THRESHOLD;

    let stats = await PlayerStats.findOneAndUpdate(
      { user: playerId },
      {
        $inc: {
          totalGamesPlayed: 1,
          totalScore: score,
          [`modes.${mode}.gamesPlayed`]: 1,
          [`modes.${mode}.totalScore`]: score,
          ...(isWin
            ? {
                totalWins: 1,
                [`modes.${mode}.wins`]: 1,
                currentWinStreak: 1,
              }
            : {
                totalLosses: 1,
                [`modes.${mode}.losses`]: 1,
                currentLoseStreak: 1,
              }),
        },

        $max: {
          highestScoreEver: score,
          [`modes.${mode}.highestScore`]: score,
        },

        $set: {
          lastPlayedAt: new Date(),
        },
      },
      { new: true, upsert: true },
    );

    stats.modes[mode].averageScore =
      stats.modes[mode].totalScore / stats.modes[mode].gamesPlayed;

    stats.modes[mode].winRatio =
      stats.modes[mode].wins / stats.modes[mode].gamesPlayed;

    stats.averageScore = stats.totalScore / stats.totalGamesPlayed;

    stats.overallWinRatio = stats.totalWins / stats.totalGamesPlayed;

    if (isWin) {
      stats.currentLoseStreak = 0;

      if (stats.currentWinStreak > stats.bestWinStreak) {
        stats.bestWinStreak = stats.currentWinStreak;
      }
    } else {
      stats.currentWinStreak = 0;
    }

    await stats.save();

    console.log(`[analytics] recorded  session=${session.sessionCode}`);
  } catch (err) {
    console.error(`[analytics] FAILED  session=${session.sessionCode}:`, err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMER EXPIRY HANDLER
// Extracted so it can be reasoned about independently of socket plumbing.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs when the server-side countdown for a question expires.
 *
 * Steps:
 *  1. Generation guard  — drop stale callbacks instantly.
 *  2. Reload session    — always read fresh DB state; never trust in-memory.
 *  3. Idempotency check — bail if player already submitted before timeout fired.
 *  4. Record miss       — mark question used + push incorrect attempt.
 *  5. Clear DB timer    — atomic update before the document save.
 *  6. Advance           — move to next question OR end the game.
 *  7. Analytics         — written on game-end only.
 *  8. Emit              — time-up (next question) or game-ended.
 */
async function handleTimerExpiry(sessionCode, generation) {
  // ── 1. Generation guard ────────────────────────────────────────────────────
  const current = activeTimers.get(sessionCode);
  if (!current || current.generation !== generation) {
    console.log(
      `[timer] stale expiry dropped  session=${sessionCode}  ` +
        `captured-gen=${generation}  current-gen=${current?.generation ?? "none"}`,
    );
    return;
  }

  activeTimers.delete(sessionCode);
  console.log(
    `[timer] handling expiry  session=${sessionCode}  gen=${generation}`,
  );

  // ── 2. Reload session ──────────────────────────────────────────────────────
  const session = await GameSession.findOne({ sessionCode });
  if (!session) {
    console.warn(`[timer] session not found on expiry  session=${sessionCode}`);
    return;
  }

  const questionId = session.progress.currentQuestionId;

  // ── 3. Idempotency check ───────────────────────────────────────────────────
  // The player may have submitted an answer in the brief window between the
  // event-loop queuing this callback and it actually executing.
  const alreadyAnswered = session.soloPlayer.attemptHistory.some(
    (a) => a.questionId.toString() === questionId.toString(),
  );

  if (alreadyAnswered) {
    console.log(
      `[timer] player already answered, expiry is no-op  session=${sessionCode}`,
    );
    // The submit path owns timer clearing and question advancement from here.
    return;
  }

  // ── 4. Record miss ─────────────────────────────────────────────────────────
  const questionEntry = getQuestionFromPool(session, questionId);
  if (questionEntry && !questionEntry.used) {
    questionEntry.used = true;
  }
  session.soloPlayer.attemptHistory.push({ questionId, isCorrect: false });

  // ── 5. Clear DB timer atomically ───────────────────────────────────────────
  // Write this before session.save() so a crash mid-save doesn't leave a stale
  // startedAt visible to a reconnecting client.
  await GameSession.findOneAndUpdate(
    { sessionCode },
    {
      "progress.questionTimer.startedAt": null,
      "progress.questionTimer.expiresAt": null,
    },
  );

  session.progress.questionTimer.startedAt = null;
  session.progress.questionTimer.expiresAt = null;

  // ── 6. Advance ─────────────────────────────────────────────────────────────
  const { status, nextQuestionEntry } = getNextQuestionSolo(session);

  if (status === "ended") {
    // ── GAME OVER ────────────────────────────────────────────────────────────
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    console.log(`[timer] game ended  session=${sessionCode}`);

    // ── 7. Analytics ──────────────────────────────────────────────────────────
    await recordAnalytics(session);

    // ── 8. Emit ───────────────────────────────────────────────────────────────
    io.to(sessionCode).emit("game-ended");
    return;
  }

  // ── NEXT QUESTION ──────────────────────────────────────────────────────────
  const nextQuestion = await Question.findById(
    nextQuestionEntry.questionId,
  ).populate("categoryId", "_id name thumbnail");

  if (!nextQuestion) {
    console.error(
      `[timer] next question not found  session=${sessionCode}  ` +
        `questionId=${nextQuestionEntry.questionId}`,
    );
    return;
  }

  session.progress.currentCategory = nextQuestion.categoryId;
  session.progress.currentPointLevel = nextQuestionEntry.points;
  session.progress.currentQuestionId = nextQuestion._id;

  await session.save();

  console.log(
    `[timer] advancing  session=${sessionCode}  nextQuestion=${nextQuestion._id}`,
  );

  // ── 8. Emit ─────────────────────────────────────────────────────────────────
  io.to(sessionCode).emit("time-up", {
    session,
    currentQuestion: formatQuestion(nextQuestion),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ARM TIMER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist timer state to DB, broadcast timer-start, then set the server
 * setTimeout with elapsed-time and latency compensation.
 *
 * @param {string} sessionCode
 * @param {Date}   startedAt    The canonical start instant (used as the reference).
 * @param {number} duration     Question duration in seconds.
 * @param {number} latencyMs    One-way client latency buffer in ms.
 */
async function armTimer(sessionCode, startedAt, duration, latencyMs) {
  // ── Write to DB first so the source of truth is always Mongo ──────────────
  const expiresAt = new Date(startedAt.getTime() + duration * 1000);

  await GameSession.findOneAndUpdate(
    { sessionCode },
    {
      "progress.questionTimer.startedAt": startedAt,
      "progress.questionTimer.expiresAt": expiresAt,
    },
  );

  // ── Bump generation (cancel old handle as a courtesy) ─────────────────────
  const prevEntry = activeTimers.get(sessionCode);
  const generation = (prevEntry?.generation ?? 0) + 1;
  if (prevEntry?.timeout) clearTimeout(prevEntry.timeout);

  // ── Broadcast timer-start before we block on setTimeout ───────────────────
  // Clients need the ISO string so their own timers sync to wall-clock time,
  // not to the moment they receive the event (network delay varies per client).
  io.to(sessionCode).emit("timer-start", {
    startedAt: startedAt.toISOString(),
    timer: duration,
  });

  // ── Compensate for time already consumed by the DB write ──────────────────
  const elapsedMs = Date.now() - startedAt.getTime();
  const remaining = Math.max(0, duration * 1000 - elapsedMs);
  const timeoutMs = remaining + latencyMs; // buffer ensures client hits 0 first

  console.log(
    `[timer] armed  session=${sessionCode}  gen=${generation}  ` +
      `duration=${duration}s  db-elapsed=${(elapsedMs / 1000).toFixed(2)}s  ` +
      `server-timeout=${(timeoutMs / 1000).toFixed(2)}s  latency=${latencyMs}ms`,
  );

  const timeout = setTimeout(
    () => handleTimerExpiry(sessionCode, generation),
    timeoutMs,
  );

  activeTimers.set(sessionCode, { timeout, generation });
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export const handleConnection = (socket) => {
  // ── Latency measurement ────────────────────────────────────────────────────
  socket.emit("ping", { t1: Date.now() });

  socket.on("pong", ({ t1 }) => {
    const rtt = Date.now() - t1;
    playerLatency.set(socket.id, Math.round(rtt / 2));
  });

  // ── Room management ────────────────────────────────────────────────────────
  socket.on("join-session-room", (sessionCode) => {
    socket.join(sessionCode);
    socket.currentSession = sessionCode;
    console.log(`[socket] joined  socket=${socket.id}  session=${sessionCode}`);
  });

  // ── Game lifecycle ─────────────────────────────────────────────────────────
  socket.on("game-started", ({ sessionCode }) => {
    io.to(sessionCode).emit("game-started", { message: "Game has started!" });
  });
  socket.on("player-joined", async ({ sessionCode, teamName, userId }) => {
    // Update DB (if needed) — though your API already handles this
    io.to(sessionCode).emit("update-session");
  });
  socket.on("gameUpdated", async (sessionCode) => {
    try {
      const session = await GameSession.findOne({ sessionCode }).lean();
      const qId = session?.progress?.currentQuestionId;
      if (!qId) return;

      const question = await Question.findById(qId)
        .populate("categoryId", "_id name thumbnail")
        .lean();

      if (!question) return;

      io.to(sessionCode).emit("chngeState", {
        session,
        currentQuestion: formatQuestion(question),
      });
    } catch (err) {
      console.error("[gameUpdated] error:", err);
    }
  });

  // ── player-ready ───────────────────────────────────────────────────────────
  /**
   * Three cases:
   *
   *  A) No timer running yet       → arm a fresh timer.
   *  B) Timer already running      → re-sync THIS socket only (reconnect case).
   *  C) Concurrent player-ready    → mutex drops the duplicate immediately.
   */
  socket.on("player-ready", async ({ sessionCode }) => {
    // ── C) Mutex ──────────────────────────────────────────────────────────────
    if (processingLock.get(sessionCode)) {
      console.log(
        `[player-ready] duplicate dropped (locked)  session=${sessionCode}`,
      );
      return;
    }
    processingLock.set(sessionCode, true);

    try {
      console.log(
        `[player-ready] received  session=${sessionCode}  socket=${socket.id}`,
      );

      const session = await GameSession.findOne({ sessionCode });
      if (!session) {
        console.warn(
          `[player-ready] session not found  session=${sessionCode}`,
        );
        return;
      }

      const timerState = session.progress.questionTimer;

      // ── B) Re-sync reconnecting client ─────────────────────────────────────
      if (timerState.startedAt) {
        const elapsedSec =
          (Date.now() - new Date(timerState.startedAt).getTime()) / 1000;
        const remainingSec = timerState.duration - elapsedSec;

        if (remainingSec > 0) {
          console.log(
            `[player-ready] timer running, re-syncing client  ` +
              `session=${sessionCode}  remaining=${remainingSec.toFixed(1)}s`,
          );

          // Unicast to THIS socket only — other sockets are already counting down
          socket.emit("timer-start", {
            startedAt: new Date(timerState.startedAt).toISOString(),
            timer: timerState.duration,
          });

          return; // ← critically: do NOT arm a second server timeout
        }

        // startedAt exists but has already expired — fall through and re-arm.
        // The previous timeout's generation guard will silence its callback.
        console.log(
          `[player-ready] stale startedAt (already expired), re-arming  session=${sessionCode}`,
        );
      }

      // ── A) Arm a fresh timer ───────────────────────────────────────────────
      const now = new Date();
      const duration = timerState.duration;
      const latency = playerLatency.get(socket.id) ?? 300;

      await armTimer(sessionCode, now, duration, latency);
    } catch (err) {
      console.error(`[player-ready] error  session=${sessionCode}:`, err);
    } finally {
      // Always release — even if we threw
      processingLock.delete(sessionCode);
    }
  });

  // ── end-game ───────────────────────────────────────────────────────────────
  socket.on("end-game", (sessionCode) => {
    // Cancel any running timer so its expiry callback doesn't fire after the
    // game is already over.
    cancelTimer(sessionCode);
    io.to(sessionCode).emit("game-ended");
    console.log(`[socket] end-game  session=${sessionCode}`);
  });

  // ── disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    playerLatency.delete(socket.id);
    console.log(`[socket] disconnected  socket=${socket.id}`);

    // Intentionally do NOT cancel the timer on disconnect.
    // The server countdown continues; if the player reconnects they hit the
    // player-ready → case B path and get re-synced automatically.
  });
};
