import { applyScoreIfCorrectSolo } from "../helper/applyScoreIfCorrect.js";
import { getNextQuestionSolo } from "../helper/getNextQuestion.js";
import { getQuestionFromPool } from "../helper/getQuestionFromPool.js";
import { generateQuestionPool } from "../helper/questionpool.js";
import { evaluateAnswer } from "../helper/evaluateAnswer.js";
import Question from "../model/questionAnswer.model.js";
import { SoloGameSession } from "../model/SoloGameSession.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import { GameSession } from "../model/GameSession.model.js";
import { GameAnalytics } from "../model/gameAnalytics.model.js";
import { customAlphabet } from "nanoid";
import { PlayerStats } from "../model/userStats.model.js";
import { cancelTimer } from "./Socket.controller.js";
import mongoose from "mongoose";
const generateCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
export const initializeGame = asyncHandler(async (req, res) => {
  const { mode, categoryIds, socketId, timer, title } = req.body;
  console.log(mode, categoryIds, socketId, timer, title);
  const userId = req.user._id;
  const username = req.user.firstname;

  // =======================
  // ✅ Basic validation
  // =======================
  if (!mode || !categoryIds || !title) {
    throw new ApiError(400, "Mode, categories, and title are required");
  }

  if (categoryIds.length !== 6) {
    throw new ApiError(400, "Exactly 6 categories are required");
  }
  if (!socketId) {
    throw new ApiError(400, "Socket ID is required for solo mode");
  }
  if (mode === "timed_solo") {
    if (!timer) {
      throw new ApiError(400, "Timer is required is Timed Solo");
    }
  }
  let soloPlayer = {
    userId: userId,
    username: username,
    socketId,
    score: 0,
    hasAnswered: false,
    attemptHistory: [],
  };

  // =======================
  // 🔢 Generate session code
  // =======================
  const sessionCode = "SESSION-" + generateCode();

  // =======================
  // 📝 Create GameSession
  // =======================
  const newSession = new GameSession({
    sessionCode,
    host: userId,
    categories: categoryIds,
    title,
    status: "waiting",
    mode,
    teams: undefined,
    soloPlayer: soloPlayer,
  });
  if (mode === "timed_solo") {
    newSession.progress.questionTimer.duration = timer;
  }

  await newSession.save();

  return res.status(200).json(
    new ApiResponse(200, "Game session created successfully", {
      sessionCode,
      sessionId: newSession._id,
    }),
  );
});

export const startSologame = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new ApiError(400, "sessionId is not provided");
  }
  const session = await GameSession.findById(sessionId);
  if (!session) {
    throw new ApiError(404, "No Such session Exist");
  }
  if (session.status === "active") {
    throw new ApiError(400, "Game Started Already");
  }

  const pool = await generateQuestionPool({
    categories: session.categories,
    mode: "solo",
  });
  session.questionPool = pool;
  session.progress.currentCategory = null;
  session.progress.currentPointLevel = 200;
  const currentQuestionEntry = session.questionPool.find(
    (q) => !q.used && q.points === session.progress.currentPointLevel,
  );
  if (!currentQuestionEntry) {
    throw new ApiError(400, "No available questions for this team");
  }
  const currentQuestion = await Question.findById(
    currentQuestionEntry.questionId,
  );
  if (!currentQuestion) {
    throw new ApiError(404, "Question not found");
  }
  session.questionPool = pool;
  session.progress.currentCategory = currentQuestion.categoryId;
  session.progress.currentPointLevel = currentQuestionEntry.points;
  session.progress.currentQuestionId = currentQuestion._id;
  session.usedCategories = [];

  session.status = "active";
  session.startedAt = new Date();

  await session.save();
  return res.status(200).json(
    new ApiResponse(200, "Game started successfully", {
      sessionId: session._id,
      status: session.status,
    }),
  );
});

export const endSoloGame = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;
  const userId = req.user._id;

  const session = await GameSession.findOne({ sessionCode: sessionCode });

  if (!session) {
    throw new ApiError(404, "Session does not exist");
  }

  if (session.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to end this session");
  }

  if (session.status === "completed") {
    return res
      .status(400)
      .json(new ApiResponse(200, "Session already completed"));
  }
  if (session.status === "active") {
    session.status = "completed";
    await session.save();
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

    /* =========================
   STREAK FIX
========================= */

    if (isWin) {
      stats.currentLoseStreak = 0;

      if (stats.currentWinStreak > stats.bestWinStreak) {
        stats.bestWinStreak = stats.currentWinStreak;
      }
    } else {
      stats.currentWinStreak = 0;
    }

    await stats.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Game ended successfully"));
  }
  if (session.status === "waiting") {
    session.status = "completed";
    await session.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Session was waiting, now marked as completed"),
      );
  }
  throw new ApiError(400, "Invalid session status");
});

export const SubmitAnswerSolo = asyncHandler(async (req, res) => {
  const { sessionId, questionId, answer } = req.body;

  // ✅ Atomic claim — only one winner between REST and timer expiry
  const claimed = await GameSession.findOneAndUpdate(
    {
      _id: sessionId,
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
      },
    },
    { new: false }, // return original doc so we can read timer values
  );

  // Timer already fired and claimed this question first
  if (!claimed) {
    throw new ApiError(400, "Question already answered or session inactive");
  }

  // ✅ Cancel timer — we own the question now
  cancelTimer(claimed.sessionCode);

  // ✅ Re-fetch fresh session after atomic update
  const session = await GameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session does not exist");
  if (!session.soloPlayer) throw new ApiError(400, "No solo player found");

  // ✅ Use claimed (original doc) for timer check — session already has null timer
  let timedOut = false;
  if (session.mode === "timed_solo") {
    const timer = claimed.progress.questionTimer; // ← claimed not session
    if (timer?.startedAt) {
      const elapsed = Date.now() - new Date(timer.startedAt).getTime();
      const allowed = timer.duration * 1000 + 500;
      if (elapsed > allowed) {
        console.log("⏰ Timer expired on server");
        timedOut = true;
      }
    } else {
      console.log("⏰ Timer already cleared");
      timedOut = true;
    }
  }

  // ✅ No questionEntry check needed — atomic claim already handled it
  const originalQuestion = await Question.findById(questionId);
  if (!originalQuestion) throw new ApiError(404, "Original question not found");

  const isCorrect = timedOut
    ? false
    : evaluateAnswer(originalQuestion.answer, answer);

  session.soloPlayer.attemptHistory.push({ questionId, isCorrect });
  if (isCorrect) session.soloPlayer.score += session.progress.currentPointLevel;
  session.markModified("soloPlayer");

  // ✅ Timer already cleared atomically — just mirror on in-memory doc
  session.progress.questionTimer.startedAt = null;
  session.progress.questionTimer.expiresAt = null;

  const { status, nextQuestionEntry } = getNextQuestionSolo(session);

  // ─── Game Ended ───────────────────────────────────────────────
  if (status === "ended") {
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    const totalQuestionsPlayed = session.soloPlayer.attemptHistory.length;
    const totalScore = session.soloPlayer.score;

    await GameAnalytics.create({
      sessionId: session._id,
      host: session.host,
      mode: session.mode,
      categories: session.categories,
      players: session.soloPlayer.userId ? [session.soloPlayer.userId] : [],
      playersCount: 1,
      totalQuestionsPlayed,
      averageScore: totalScore, // solo = just their score
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      // durationSeconds auto-computed by pre-save hook
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

    /* =========================
   STREAK FIX
========================= */

    if (isWin) {
      stats.currentLoseStreak = 0;

      if (stats.currentWinStreak > stats.bestWinStreak) {
        stats.bestWinStreak = stats.currentWinStreak;
      }
    } else {
      stats.currentWinStreak = 0;
    }

    await stats.save();
    return res.status(200).json(
      new ApiResponse(
        200,
        isCorrect
          ? "Correct answer! Game Ended"
          : "Incorrect answer! Game Ended",
        {
          isCorrect,
          correctAnswer: originalQuestion.answer,
          pointsAwarded: isCorrect ? originalQuestion.points : 0,
          gameEnded: true,
          score: session.soloPlayer.score,
          username: session.soloPlayer.username,
        },
      ),
    );
  }

  // ─── Next Question ────────────────────────────────────────────
  const nextQuestion = await Question.findById(
    nextQuestionEntry.questionId,
  ).populate("categoryId", "_id name thumbnail");
  if (!nextQuestion) throw new ApiError(404, "Next question not found");

  session.progress.currentCategory = nextQuestion.categoryId;
  session.progress.currentPointLevel = nextQuestionEntry.points;
  session.progress.currentQuestionId = nextQuestion._id;

  await session.save();

  const nextQuestionResponse = {
    questionId: nextQuestion._id,
    points: nextQuestion.points,
    questionImage: nextQuestion.questionImage,
    questionText: nextQuestion.questionText,
    AnswerImage: nextQuestion.answerImage,
    options: nextQuestion.options,
    Answer: nextQuestion.answer,
    category: {
      id: nextQuestion.categoryId._id,
      name: nextQuestion.categoryId.name,
      thumbnail: nextQuestion.categoryId.thumbnail,
    },
  };

  return res.status(200).json(
    new ApiResponse(200, "Answer submitted successfully", {
      isCorrect,
      correctAnswer: originalQuestion.answer,
      pointsAwarded: isCorrect ? originalQuestion.points : 0,
      gameEnded: false,
      nextQuestion: nextQuestionResponse,
    }),
  );
});
// export const CurrentQuestionSolo = asyncHandler(async (req, res) => {
//   const { sessionId } = req.params;

//   const session = await GameSession.findById(sessionId);
//   if (!session) {
//     throw new ApiError(404, "Session not found");
//   }
//   if (session.status !== "active") {
//     throw new ApiError(400, "Game session is not active");
//   }
//   const currentQuestion = await Question.findById(
//     session.progress.currentQuestionId,
//   ).populate("categoryId", "_id name thumbnail");
//   if (!currentQuestion) {
//     throw new ApiError(404, "Question not Found");
//   }
//   const currentQuestionresponse = {
//     questionId: currentQuestion._id,
//     points: currentQuestion.points,
//     questionImage: currentQuestion.questionImage,
//     questionText: currentQuestion.questionText,
//     AnswerImage: currentQuestion.answerImage,
//     options: currentQuestion.options,
//     Answer: currentQuestion.answer,
//     category: {
//       id: currentQuestion.categoryId._id,
//       name: currentQuestion.categoryId.name,
//       thumbnail: currentQuestion.categoryId.thumbnail,
//     },
//   };
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         "current Question fetched Successfully",
//         currentQuestionresponse,
//       ),
//     );
// });
// export const SoloSessionInfo = asyncHandler(async (req, res) => {
//   const { sessionId } = req.params;

//   const session = await GameSession.findOne({
//     sessionCode: sessionId,
//   }).populate("categories");
//   if (!session) throw new ApiError(404, "Session not found");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, "Session fetched successfully", session));
// });
