import mongoose from "mongoose";
import { GameSession } from "../model/GameSession.model.js";
import { GameAnalytics } from "../model/gameAnalytics.model.js";
import { PlayerStats } from "../model/userStats.model.js";
import Question from "../model/questionAnswer.model.js";
import { getNextQuestionSolo } from "./getNextQuestion.js";

// ─── Shared answer format ────────────────────────────────────────────────────
export function formatQuestion(question) {
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

// ─── Atomic DB claim ─────────────────────────────────────────────────────────
// Returns the PRE-UPDATE document if claim succeeded, null if already claimed.
// Both REST and socket paths call this — it is the single race-condition firewall.
export async function atomicClaimQuestion(sessionCode, questionId) {
  return GameSession.findOneAndUpdate(
    {
      sessionCode:sessionCode,
      status: "active",
      questionPool: {
        $elemMatch: {
          questionId: new mongoose.Types.ObjectId(questionId),
          used: false,
        },
      },
    },
    {
      $set: {
        "questionPool.$.used": true,
        "progress.questionTimer.startedAt": null,
        "progress.questionTimer.expiresAt": null,
        "soloPlayer.hasAnswered": true,
      },
    },
    { new: false }, // return ORIGINAL so caller can read the old timer values
  );
}

// ─── Timestamp grace check (solution 2) ──────────────────────────────────────
// Called only for timed_solo. Returns true if the answer should be counted.
export function isAnswerInTime(answeredAt, claimedDoc, gracePeriodMs = 1500) {
  const timer = claimedDoc.progress.questionTimer;
  if (!timer?.startedAt) {
    // Timer was already cleared by server expiry before claim succeeded —
    // this means the atomic claim raced with the timer and the timer won.
    // Treat as late.
    return false;
  }
  const expiresAt = new Date(timer.startedAt).getTime() + timer.duration * 1000;
  return answeredAt <= expiresAt + gracePeriodMs;
}

// ─── Core answer processing ───────────────────────────────────────────────────
// Writes attempt, score, advances progress. Returns { isCorrect, status, nextQuestion? }
// status: 'next' | 'ended'
export async function processAnswer(session, questionId, isCorrect) {
  // Record attempt
  session.soloPlayer.attemptHistory.push({ questionId, isCorrect });

  // Award points
  if (isCorrect) {
    session.soloPlayer.score += session.progress.currentPointLevel;
  }

  session.markModified("soloPlayer");

  // Advance
  const { status, nextQuestionEntry } = getNextQuestionSolo(session);

  if (status === "ended") {
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();
    return { isCorrect, status: "ended" };
  }

  const nextQuestion = await Question.findById(
    nextQuestionEntry.questionId,
  ).populate("categoryId", "_id name thumbnail");

  if (!nextQuestion)
    throw new Error(`Next question not found: ${nextQuestionEntry.questionId}`);

  session.progress.currentCategory = nextQuestion.categoryId;
  session.progress.currentPointLevel = nextQuestionEntry.points;
  session.progress.currentQuestionId = nextQuestion._id;
  session.soloPlayer.hasAnswered = false; // reset for next question

  await session.save();

  return { isCorrect, status: "next", nextQuestion };
}

// ─── Analytics + stats (extracted from both REST controller and socket) ───────
export async function recordGameEnd(session) {
  try {
    const attempts = session.soloPlayer.attemptHistory;
    const totalQuestionsPlayed = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;

    await GameAnalytics.create({
      sessionId: session._id,
      host: session.host,
      mode: session.mode,
      categories: session.categories,
      players: session.soloPlayer.userId ? [session.soloPlayer.userId] : [],
      playersCount: 1,
      totalQuestionsPlayed,
      averageScore:
        totalQuestionsPlayed > 0 ? correctCount / totalQuestionsPlayed : 0,
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
            ? { totalWins: 1, [`modes.${mode}.wins`]: 1, currentWinStreak: 1 }
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
        $set: { lastPlayedAt: new Date() },
      },
      { new: true, upsert: true },
    );

    // Derived fields Mongo can't compute atomically
    stats.modes[mode].averageScore =
      stats.modes[mode].totalScore / stats.modes[mode].gamesPlayed;
    stats.modes[mode].winRatio =
      stats.modes[mode].wins / stats.modes[mode].gamesPlayed;
    stats.averageScore = stats.totalScore / stats.totalGamesPlayed;
    stats.overallWinRatio = stats.totalWins / stats.totalGamesPlayed;

    if (isWin) {
      stats.currentLoseStreak = 0;
      if (stats.currentWinStreak > stats.bestWinStreak)
        stats.bestWinStreak = stats.currentWinStreak;
    } else {
      stats.currentWinStreak = 0;
    }

    await stats.save();
  } catch (err) {
    console.error(
      `[recordGameEnd] analytics failed session=${session.sessionCode}:`,
      err,
    );
    // swallowed — analytics must never break game-ended
  }
}
