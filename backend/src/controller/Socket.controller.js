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
 * FIX Bug 5: Raised from 1500ms to 2000ms.
 *
 * GRACE_PERIOD_MS is added to the server timeout so the client's visual
 * countdown always reaches zero before the server cuts the question. With the
 * client timer fixed to fire at remaining <= 0, the theoretical minimum buffer
 * is one tick (500ms) + one-way latency. 2000ms gives a comfortable margin
 * even on 700ms RTT connections while still feeling fair.
 */
const GRACE_PERIOD_MS = 2000;

/**
 * sessionCode → boolean
 *
 * Async mutex. Held for the duration of the player-ready async handler.
 * A second player-ready that arrives while the first is still awaiting DB
 * calls is dropped immediately, preventing duplicate timer arms.
 *
 * FIX Bug 6: This map is now also cleaned up in the disconnect handler so a
 * socket that disconnects mid-handler never leaves a permanent lock.
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

/**
 * FIX Bug 7 (latency not ready): socketId → Array of pending player-ready
 * handlers. If player-ready fires before the first pong round-trip completes
 * we queue the handler and replay it once pong arrives.
 *
 * socketId → { sessionCode: string }[]
 */
const pendingPlayerReady = new Map();

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
// ─────────────────────────────────────────────────────────────────────────────

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
  const alreadyAnswered = session.soloPlayer.attemptHistory.some(
    (a) => a.questionId.toString() === questionId.toString(),
  );

  if (alreadyAnswered) {
    console.log(
      `[timer] player already answered, expiry is no-op  session=${sessionCode}`,
    );
    return;
  }

  // ── 4. Record miss ─────────────────────────────────────────────────────────
  const questionEntry = getQuestionFromPool(session, questionId);
  if (questionEntry && !questionEntry.used) {
    questionEntry.used = true;
  }
  session.soloPlayer.attemptHistory.push({ questionId, isCorrect: false });

  // ── 5. Clear DB timer atomically ───────────────────────────────────────────
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
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    console.log(`[timer] game ended  session=${sessionCode}`);

    await recordAnalytics(session);

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

  io.to(sessionCode).emit("time-up", {
    session,
    currentQuestion: formatQuestion(nextQuestion),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ARM TIMER
// ─────────────────────────────────────────────────────────────────────────────

async function armTimer(sessionCode, startedAt, duration, latencyMs) {
  const expiresAt = new Date(startedAt.getTime() + duration * 1000);

  await GameSession.findOneAndUpdate(
    { sessionCode },
    {
      "progress.questionTimer.startedAt": startedAt,
      "progress.questionTimer.expiresAt": expiresAt,
    },
  );

  const prevEntry = activeTimers.get(sessionCode);
  const generation = (prevEntry?.generation ?? 0) + 1;
  if (prevEntry?.timeout) clearTimeout(prevEntry.timeout);

  io.to(sessionCode).emit("timer-start", {
    startedAt: startedAt.toISOString(),
    timer: duration,
  });

  const elapsedMs = Date.now() - startedAt.getTime();
  const remaining = Math.max(0, duration * 1000 - elapsedMs);
  const timeoutMs = remaining + latencyMs + GRACE_PERIOD_MS;

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
// PLAYER-READY CORE LOGIC
// Extracted so it can be called both immediately and from the pong-deferred queue.
// ─────────────────────────────────────────────────────────────────────────────

async function handlePlayerReady(socket, sessionCode) {
  // ── Mutex ──────────────────────────────────────────────────────────────────
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
      console.warn(`[player-ready] session not found  session=${sessionCode}`);
      return;
    }

    const timerState = session.progress.questionTimer;

    // ── Re-sync reconnecting client ────────────────────────────────────────
    if (timerState.startedAt) {
      const elapsedSec =
        (Date.now() - new Date(timerState.startedAt).getTime()) / 1000;
      const remainingSec = timerState.duration - elapsedSec;

      if (remainingSec > 0) {
        console.log(
          `[player-ready] timer running, re-syncing client  ` +
            `session=${sessionCode}  remaining=${remainingSec.toFixed(1)}s`,
        );

        socket.emit("timer-start", {
          startedAt: new Date(timerState.startedAt).toISOString(),
          timer: timerState.duration,
        });

        return;
      }

      console.log(
        `[player-ready] stale startedAt (already expired), re-arming  session=${sessionCode}`,
      );
    }

    // ── Arm a fresh timer ──────────────────────────────────────────────────
    const now = new Date();
    const duration = timerState.duration;

    // FIX Bug 7: use measured latency; safe default is 500ms (was 300ms).
    // The pendingPlayerReady queue (below) ensures this path is only reached
    // after at least one pong has been measured, so the default is a true
    // last-resort for very fast pong drops, not the common case.
    const latency = playerLatency.get(socket.id) ?? 500;

    await armTimer(sessionCode, now, duration, latency);
  } catch (err) {
    console.error(`[player-ready] error  session=${sessionCode}:`, err);
  } finally {
    processingLock.delete(sessionCode);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export const handleConnection = (socket) => {
  // ── Latency measurement ────────────────────────────────────────────────────
  socket.emit("ping", { t1: Date.now() });

  socket.on("pong", ({ t1 }) => {
    const rtt = Date.now() - t1;
    const oneWay = Math.round(rtt / 2);
    playerLatency.set(socket.id, oneWay);

    console.log(
      `[pong] socket=${socket.id}  rtt=${rtt}ms  one-way=${oneWay}ms`,
    );

    // FIX Bug 7: drain any player-ready events that arrived before the first
    // pong. Now that we have a real latency measurement, arm the timer properly.
    const queued = pendingPlayerReady.get(socket.id);
    if (queued && queued.length > 0) {
      pendingPlayerReady.delete(socket.id);
      // Replay only the last queued event — duplicates from re-renders don't matter.
      const { sessionCode } = queued[queued.length - 1];
      console.log(
        `[pong] replaying queued player-ready  session=${sessionCode}  socket=${socket.id}`,
      );
      handlePlayerReady(socket, sessionCode);
    }
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

  socket.on("player-joined", async ({ sessionCode }) => {
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
  socket.on("player-ready", async ({ sessionCode }) => {
    // FIX Bug 7: If we haven't received a pong yet, queue this event.
    // The pong handler will drain the queue with the correct latency value.
    if (!playerLatency.has(socket.id)) {
      console.log(
        `[player-ready] latency not yet known, queuing  session=${sessionCode}  socket=${socket.id}`,
      );
      const queue = pendingPlayerReady.get(socket.id) ?? [];
      queue.push({ sessionCode });
      pendingPlayerReady.set(socket.id, queue);
      return;
    }

    await handlePlayerReady(socket, sessionCode);
  });

  // ── end-game ───────────────────────────────────────────────────────────────
  socket.on("end-game", (sessionCode) => {
    cancelTimer(sessionCode);
    io.to(sessionCode).emit("game-ended");
    console.log(`[socket] end-game  session=${sessionCode}`);
  });

  // ── disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    playerLatency.delete(socket.id);
    pendingPlayerReady.delete(socket.id);

    // FIX Bug 6: If this socket was inside a player-ready handler when it
    // disconnected, release the lock so the next player-ready can proceed.
    // socket.currentSession is set in the join-session-room handler.
    if (socket.currentSession) {
      processingLock.delete(socket.currentSession);
    }

    console.log(`[socket] disconnected  socket=${socket.id}`);

    // Intentionally do NOT cancel the timer on disconnect.
    // The server countdown continues; if the player reconnects they hit the
    // player-ready → re-sync path and get synced automatically.
  });
};
