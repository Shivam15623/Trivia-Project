import {
  atomicClaimQuestion,
  isAnswerInTime,
  processAnswer,
  recordGameEnd,
} from "../helper/gameHelpers.js";
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
const GRACE_PERIOD_MS = 1500;
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
  const expiredQuestion = await Question.findById(questionId);
  const correctAnswer = expiredQuestion?.answer ?? null;
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
    correctAnswer,
    session,
    currentQuestion: formatQuestion(nextQuestion),
    answerImage: expiredQuestion?.answerImage ?? null, // ← add
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
async function armTimer(
  sessionCode,
  startedAt,
  duration,
  latencyMs,
  prefetchedSession = null,
  prefetchedQuestion = null,
) {
  const expiresAt = new Date(startedAt.getTime() + duration * 1000+latencyMs);

  await GameSession.findOneAndUpdate(
    { sessionCode },
    {
      "progress.questionTimer.startedAt": startedAt,
      "progress.questionTimer.expiresAt": expiresAt,
    },
  );

  // Use prefetched data if available — skip the DB reads
  const session =
    prefetchedSession ?? (await GameSession.findOne({ sessionCode }));
  const currentQuestion =
    prefetchedQuestion ??
    (await Question.findById(session.progress.currentQuestionId).populate(
      "categoryId",
      "_id name thumbnail",
    ));

  if (!currentQuestion) {
    console.error(
      `[armTimer] currentQuestion not found  session=${sessionCode}`,
    );
    return;
  }

  // ── Bump generation (cancel old handle as a courtesy) ─────────────────────
  const prevEntry = activeTimers.get(sessionCode);
  const generation = (prevEntry?.generation ?? 0) + 1;
  if (prevEntry?.timeout) clearTimeout(prevEntry.timeout);

  // ── Broadcast timer-start before we block on setTimeout ───────────────────
  // Clients need the ISO string so their own timers sync to wall-clock time,
  // not to the moment they receive the event (network delay varies per client).
  io.to(sessionCode).emit("timer-start", {
    startedAt: startedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    timer: duration,
    currentQuestion: formatQuestion(currentQuestion),
  });

  // ── Compensate for time already consumed by the DB write ──────────────────
  const elapsedMs = Date.now() - startedAt.getTime();
  const remaining = Math.max(0, duration * 1000 - elapsedMs);
  const timeoutMs = remaining + latencyMs + GRACE_PERIOD_MS; // buffer ensures client hits 0 first

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
      if (session.soloPlayer.userId.toString() !== socket.user._id.toString()) {
        console.warn(
          `[player-ready] unauthorized  socket=${socket.id}  session=${sessionCode}`,
        );
        socket.emit("error", {
          message: "You are not the player for this session",
        });
        return;
      }

      const timerState = session.progress.questionTimer;
      console.log(timerState);

      // ── B) Re-sync reconnecting client ─────────────────────────────────────
      if (timerState.startedAt) {
        const elapsedSec =
          (Date.now() - new Date(timerState.startedAt).getTime()) / 1000;
        const remainingSec = timerState.duration - elapsedSec;
        console.log(remainingSec);
        if (remainingSec > 0) {
          console.log(
            `[player-ready] timer running, re-syncing client  ` +
              `session=${sessionCode}  remaining=${remainingSec.toFixed(1)}s`,
          );
          const currentQuestion = await Question.findById(
            session.progress.currentQuestionId,
          ).populate("categoryId", "_id name thumbnail");

          const latency = playerLatency.get(socket.id) ?? 300;

          const adjustedExpiresAt =
            new Date(timerState.startedAt).getTime() +
            timerState.duration * 1000 +
            (latency/2);

          socket.emit("timer-start", {
            startedAt: new Date(timerState.startedAt).toISOString(),
            expiresAt: new Date(adjustedExpiresAt).toISOString(),
            timer: timerState.duration,
            currentQuestion: formatQuestion(currentQuestion),
          });
          // Unicast to THIS socket only — other sockets are already counting down

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

      await armTimer(sessionCode, now, duration, latency/2, session);
    } catch (err) {
      console.error(`[player-ready] error  session=${sessionCode}:`, err);
    } finally {
      // Always release — even if we threw
      processingLock.delete(sessionCode);
    }
  });
  socket.on(
    "submit-answer",
    async ({ sessionCode, questionId, answer, answeredAt }, ack) => {
      try {
        // ── Atomic claim — identical firewall as REST ────────────────────────────
        const claimed = await atomicClaimQuestion(sessionCode, questionId);

        if (!claimed) {
          // Already claimed by timer expiry or duplicate submit
          return ack?.({ status: "duplicate" });
        }
        if (
          claimed.soloPlayer.userId.toString() !== socket.user._id.toString()
        ) {
          console.warn(`[submit-answer] unauthorized  socket=${socket.id}`);
          return ack?.({ status: "error", message: "Unauthorized" });
        }
        cancelTimer(sessionCode);

        // ── Timestamp guard (solution 2) — only timed_solo uses socket submit ────
        const inTime = isAnswerInTime(answeredAt, claimed, GRACE_PERIOD_MS);

        const session = await GameSession.findOne({ sessionCode: sessionCode });
        if (!session)
          return ack?.({ status: "error", message: "session not found" });

        const originalQuestion = await Question.findById(questionId).populate(
          "categoryId",
          "_id name thumbnail",
        );
        if (!originalQuestion)
          return ack?.({ status: "error", message: "question not found" });

        const isCorrect = inTime ? originalQuestion.answer === answer : false;

        if (!inTime) {
          console.log(
            `[submit-answer] late answer  session=${sessionCode}  grace=${GRACE_PERIOD_MS}ms`,
          );
        }

        // ── Shared processing ────────────────────────────────────────────────────
        const { status, nextQuestion } = await processAnswer(
          session,
          questionId,
          isCorrect,
        );

        const pointsAwarded = isCorrect ? originalQuestion.points : 0;

        // Fast ack — client unblocks immediately
        ack?.({
          status: "ok",
          isCorrect,
          correctAnswer: originalQuestion.answer,
          pointsAwarded,
          inTime,
        });

        if (status === "ended") {
          await recordGameEnd(session);
          io.to(sessionCode).emit("game-ended");
          return;
        }

        // Full reveal event — carries next question so client can preload it
        socket.emit("answer-result", {
          isCorrect,
          correctAnswer: originalQuestion.answer,
          pointsAwarded,
          nextQuestion: formatQuestion(nextQuestion),
          answerImage: originalQuestion.answerImage ?? null,
        });
      } catch (err) {
        console.error(`[submit-answer] error  session=${sessionCode}:`, err);
        ack?.({ status: "error" });
      }
    },
  );
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
