import { GameSession } from "../model/GameSession.model.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import Game from "../model/Game.model.js";
import { ApiError } from "../utills/ApiError.js";
import { generateQuestionPool } from "../helper/questionpool.js";
import Question from "../model/questionAnswer.model.js";
import { validateSession } from "../helper/validateSession.js";
import { getQuestionFromPool } from "../helper/getQuestionFromPool.js";
import { evaluateAnswer } from "../helper/evaluateAnswer.js";
import {
  applyScoreIfCorrect,
  applyScoreIfCorrectSolo,
} from "../helper/applyScoreIfCorrect.js";
import { markQuestionAndPlayerUsed } from "../helper/markQuestionAndPlayerUsed.js";
import { rotateTurn } from "../helper/rotateTurn.js";
import { customAlphabet } from "nanoid";
import { getNextQuestion } from "../helper/getNextQuestion.js";
import { finalizeProgress } from "../helper/finalizeProgress.js";
import { io } from "../index.js";
import { GameAnalytics } from "../model/gameAnalytics.model.js";
import { PlayerStats } from "../model/userStats.model.js";
const generateCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export const StartSession = asyncHandler(async (req, res) => {
  const {
    mode, // "solo" | "team" | "timed_solo"
    categoryIds,
    teamAName,
    teamBName,
    teamAmembers,
    teamBmembers,
    socketId,
    hostTeam,
    title,
  } = req.body;

  const hostId = req.user._id;
  const hostName = req.user.firstname;

  // =======================
  // ✅ Basic validation
  // =======================
  if (!mode || !categoryIds || !title) {
    throw new ApiError(400, "Mode, categories, and title are required");
  }

  if (categoryIds.length !== 6) {
    throw new ApiError(400, "Exactly 6 categories are required");
  }

  // =======================
  // 👥 Team mode validation
  // =======================
  let teams = [];
  let soloPlayer = null;

  if (mode === "team") {
    if (
      !teamAName ||
      !teamBName ||
      !teamAmembers ||
      !teamBmembers ||
      !hostTeam ||
      !socketId
    ) {
      throw new ApiError(400, "All team fields are required for team mode");
    }

    const hostPlayer = {
      userId: hostId,
      username: hostName,
      socketId,
    };

    const TeamA = {
      name: teamAName,
      expectedMembers: teamAmembers,
      members: [],
    };
    const TeamB = {
      name: teamBName,
      expectedMembers: teamBmembers,
      members: [],
    };

    if (hostTeam === "A") TeamA.members.push(hostPlayer);
    else if (hostTeam === "B") TeamB.members.push(hostPlayer);
    else throw new ApiError(400, "Invalid host team selection");

    teams = [TeamA, TeamB];
  }

  // =======================
  // 👤 Solo / Timed Solo
  // =======================
  if (mode === "solo" || mode === "timed_solo") {
    if (!socketId) {
      throw new ApiError(400, "Socket ID is required for solo mode");
    }

    soloPlayer = {
      userId: hostId,
      username: hostName,
      socketId,
      score: 0,
      hasAnswered: false,
      attemptHistory: [],
    };
  }

  // =======================
  // 🔢 Generate session code
  // =======================
  const sessionCode = "SESSION-" + generateCode();

  // =======================
  // 📝 Create GameSession
  // =======================
  const newSession = new GameSession({
    sessionCode,
    host: hostId,
    categories: categoryIds,
    title,
    status: "waiting",
    mode,
    teams: teams.length ? teams : undefined,
    soloPlayer: soloPlayer || undefined,
  });

  await newSession.save();

  return res.status(200).json(
    new ApiResponse(200, "Game session created successfully", {
      sessionCode,
      sessionId: newSession._id,
    }),
  );
});

export const getSessionInfo = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;

  const session = await GameSession.findOne({ sessionCode }).populate(
    "categories",
  );
  if (!session) throw new ApiError(404, "Session not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Session fetched successfully", session));
});

// export const getWaitingRoomInfo = asyncHandler(async (req, res) => {
//   const { sessionCode } = req.params;

//   const session = await GameSession.findOne({ sessionCode });
//   if (!session) throw new ApiError(404, "Session not found");

//   const teamInfo = session.teams.map((team) => ({
//     name: team.name,
//     expectedMembers: team.expectedMembers,
//     currentMembers: team.members.length,
//     members: team.members,
//   }));

//   return res.status(200).json(
//     new ApiResponse(200, "Session fetched successfully", {
//       sessionId: session._id,
//       sessionCode: session.sessionCode,
//       status: session.status,
//       teams: teamInfo,
//       host: session.host,
//       gameId: session.gameId,
//     }),
//   );
// });
// export const joinSession = asyncHandler(async (req, res) => {
//   const { sessionCode, teamName, socketId } = req.body;

//   if (!sessionCode || !teamName || !socketId) {
//     throw new ApiError(400, "All fields are required");
//   }

//   const session = await GameSession.findOne({ sessionCode });

//   if (!session) {
//     throw new ApiError(404, "Session not found");
//   }

//   if (session.status !== "waiting") {
//     throw new ApiError(400, "Session is not joinable at this time");
//   }
//   // Check if the team exists in the session
//   const team = session.teams.find((team) => team.name === teamName);
//   if (!team) {
//     throw new ApiError(404, "Team not found");
//   }
//   const isUserInAnyTeam = session.teams.some((team) =>
//     team.members.some((m) => m.userId.toString() === req.user._id.toString()),
//   );

//   if (isUserInAnyTeam) {
//     throw new ApiError(409, "User already exists in a team");
//   }
//   // Check if the team has space for more members
//   if (team.members.length >= team.expectedMembers) {
//     throw new ApiError(400, "Team is already full");
//   }

//   // Add the user to the team
//   team.members.push({
//     userId: req.user._id,
//     username: req.user.firstname,
//     socketId,
//   });

//   // Save the session after modifying it
//   await session.save();
//   return res
//     .status(200)
//     .json(new ApiResponse(200, "Joined team successfully", session));
// });
// export const getWaitingRoomInfo = asyncHandler(async (req, res) => {
//   const { sessionCode } = req.params;

//   const session = await GameSession.findOne({ sessionCode }).populate(
//     "categories",
//   );
//   if (!session) throw new ApiError(404, "Session not found");

//   let teamInfo = [];
//   if (session.mode === "team" && session.teams?.length) {
//     teamInfo = session.teams.map((team) => ({
//       name: team.name,
//       expectedMembers: team.expectedMembers,
//       currentMembers: team.members.length,
//       members: team.members,
//     }));
//   }

//   const responseData = {
//     sessionId: session._id,
//     title: session.title,
//     categories: session.categories,
//     sessionCode: session.sessionCode,
//     status: session.status,
//     mode: session.mode,
//     host: session.host,
//   };

//   if (session.mode === "team") responseData.teams = teamInfo;
//   if (session.mode === "solo" || session.mode === "timed_solo")
//     responseData.soloPlayer = session.soloPlayer;

//   return res
//     .status(200)
//     .json(new ApiResponse(200, "Session fetched successfully", responseData));
// });

/* ===============================
   Join Session
=============================== */
export const joinSession = asyncHandler(async (req, res) => {
  const { sessionCode, teamName, socketId } = req.body;

  if (!sessionCode || !socketId)
    throw new ApiError(400, "Session code and socket ID are required");

  const session = await GameSession.findOne({ sessionCode });
  if (!session) throw new ApiError(404, "Session not found");

  if (session.status !== "waiting")
    throw new ApiError(400, "Session is not joinable at this time");

  if (session.mode === "team") {
    if (!teamName) throw new ApiError(400, "Team name is required");

    // Find the team
    const team = session.teams.find((t) => t.name === teamName);
    if (!team) throw new ApiError(404, "Team not found");

    // Check if user is already in any team
    const isUserInAnyTeam = session.teams.some((t) =>
      t.members.some((m) => m.userId.toString() === req.user._id.toString()),
    );
    if (isUserInAnyTeam)
      throw new ApiError(409, "User already exists in a team");

    // Check if team has space
    if (team.members.length >= team.expectedMembers)
      throw new ApiError(400, "Team is already full");

    // Add the user
    team.members.push({
      userId: req.user._id,
      username: req.user.firstname,
      socketId,
    });
  } else {
    // Solo / Timed Solo: only the host can play, joining not allowed
    throw new ApiError(
      400,
      "Joining a solo session is not allowed. Only the host can play.",
    );
  }

  await session.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Joined team successfully", session));
});
// export const startPlayMatch = asyncHandler(async (req, res) => {
//   const { sessionId } = req.body;

//   const session = await GameSession.findById(sessionId).populate("gameId");

//   if (!session) {
//     throw new ApiError(404, "Session not found");
//   }

//   if (session.host.toString() !== req.user._id.toString()) {
//     throw new ApiError(403, "Only the host can start the game");
//   }

//   // Ensure the game is not already started
//   if (session.status === "active") {
//     throw new ApiError(400, "Game has already started");
//   }
//   const categories = session.gameId.categories; // assuming game defines categories
//   const pool = await generateQuestionPool({ categories, questionsPerTeam: 2 });

//   // Store in session
//   session.questionPool = pool;

//   // Randomly assign the first team to answer
//   const currentTeamIndex = Math.random() > 0.5 ? 0 : 1; // Randomize first team (0 or 1)

//   // Initialize round-robin tracking data in the progress schema
//   session.progress.currentTeamIndex = currentTeamIndex;
//   session.progress.currentCategory = null; // No category selected at the start
//   session.progress.currentPointLevel = 200; // Starting from 200 points
//   session.progress.currentStep = 0; // Step 0 means it's Team A's turn to answer

//   // Initialize aids and member status
//   session.teams[currentTeamIndex].currentMemberIndex = 0;
//   session.teams[currentTeamIndex].members.forEach((member) => {
//     member.hasAnswered = false;
//   });

//   // Select the first question from the pool
//   const currentQuestionEntry = session.questionPool.find(
//     (q) =>
//       !q.used &&
//       q.teamIndex === currentTeamIndex &&
//       q.points === session.progress.currentPointLevel,
//   );
//   if (!currentQuestionEntry) {
//     throw new ApiError(400, "No available questions for this team");
//   }

//   const currentQuestion = await Question.findById(
//     currentQuestionEntry.questionId,
//   ); // Assuming 'Question' is your question model
//   if (!currentQuestion) {
//     throw new ApiError(404, "Question not found");
//   }

//   // Update the session's progress and mark the question as used
//   session.progress.currentCategory = currentQuestion.categoryId;
//   session.progress.currentPointLevel = currentQuestionEntry.points;
//   session.progress.currentQuestionId = currentQuestion._id;

//   session.usedCategories = [];
//   await session.save();

//   // Update session status to active
//   session.status = "active";
//   session.startedAt = new Date(); // Set the start time
//   await session.save();
//   io.to(session.sessionCode).emit("game-started", {
//     message: "Game has started!",
//   });

//   return res.status(200).json(
//     new ApiResponse(200, "Game started successfully", {
//       sessionCode: session.sessionCode,
//       sessionId: session._id,
//       status: session.status,
//     }),
//   );
// });

export const startPlayMatch = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  const session = await GameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  if (session.host.toString() !== req.user._id.toString())
    throw new ApiError(403, "Only the host can start the game");

  if (session.status === "active")
    throw new ApiError(400, "Game has already started");

  if (session.mode !== "team")
    throw new ApiError(400, "Only team mode is supported");

  // =========================
  // Generate question pool
  // =========================
  const pool = await generateQuestionPool({
    categories: session.categories,
    questionsPerTeam: 2,
    mode: "team",
  });

  session.questionPool = pool;
  session.usedCategories = [];
  session.status = "active";
  session.startedAt = new Date();

  // =========================
  // Initialize progress
  // =========================
  session.progress.currentCategory = null;
  session.progress.currentPointLevel = 200;

  // Random first team
  const currentTeamIndex = Math.random() > 0.5 ? 0 : 1;
  session.progress.currentTeamIndex = currentTeamIndex;
  session.progress.currentStep = 0;

  // Reset member states
  const team = session.teams[currentTeamIndex];
  team.currentMemberIndex = 0;
  team.members.forEach((m) => (m.hasAnswered = false));

  // Pick first question for this team
  const currentQuestionEntry = session.questionPool.find(
    (q) =>
      !q.used &&
      q.teamIndex === currentTeamIndex &&
      q.points === session.progress.currentPointLevel,
  );

  if (!currentQuestionEntry)
    throw new ApiError(400, "No available questions for this team");

  const currentQuestion = await Question.findById(
    currentQuestionEntry.questionId,
  );
  if (!currentQuestion) throw new ApiError(404, "Question not found");

  session.progress.currentCategory = currentQuestion.categoryId;
  session.progress.currentQuestionId = currentQuestion._id;

  await session.save();

  io.to(session.sessionCode).emit("game-started", {
    message: "Game has started!",
  });

  return res.status(200).json(
    new ApiResponse(200, "Game started successfully", {
      sessionCode: session.sessionCode,
      sessionId: session._id,
      status: session.status,
    }),
  );
});

export const currentQuestion = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;

  // Fetch the session
  const session = await GameSession.findOne({ sessionCode });
  if (!session) throw new ApiError(404, "Session not found");

  if (session.status !== "active") {
    throw new ApiError(400, "Game session is not active");
  }

  // Ensure there is a current question
  if (!session.progress?.currentQuestionId) {
    throw new ApiError(404, "No current question set for this session");
  }

  // Populate the question and its category
  const currentQuestion = await Question.findById(
    session.progress.currentQuestionId,
  ).populate("categoryId", "_id name thumbnail");

  if (!currentQuestion) throw new ApiError(404, "Question not found");

  // Build response
  const currentQuestionResponse = {
    questionId: currentQuestion._id,
    points: currentQuestion.points,
    questionImage: currentQuestion.questionImage,
    questionText: currentQuestion.questionText,
    answerImage: currentQuestion.answerImage,
    options: currentQuestion.options,
    answer: currentQuestion.answer,
    category: currentQuestion.categoryId
      ? {
          id: currentQuestion.categoryId._id,
          name: currentQuestion.categoryId.name,
          thumbnail: currentQuestion.categoryId.thumbnail,
        }
      : null,
    // Include per-question timer info if exists
    timer: session.progress.questionTimer || null,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Current question fetched successfully",
        currentQuestionResponse,
      ),
    );
});
// export const FiftyFiftyAid = asyncHandler(async (req, res) => {
//   const { gameSessionId, teamIndex, questionId } = req.body;
//   const userId = req.user._id;

//   const session = await GameSession.findById(gameSessionId);
//   const player = session.teams[teamIndex].members.find(
//     (p) => p.userId.toString === userId.toString,
//   );

//   if (!player) {
//     throw new ApiError(404, "player Not Found in Team");
//   }
//   if (player.aids.fiftyFiftyUsed) {
//     throw new ApiError(400, "the Aid is already Used");
//   }
//   const question = await Question.findById(questionId);
//   const correct = question.answer;
//   const incorrectOptions = question.options.filter((o) => o !== correct);
//   const randomWrong =
//     incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

//   // Mark aid as used
//   player.aids.fiftyFiftyUsed = true;
//   await session.save();
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, "50/50 Used Successfully", [correct, randomWrong]),
//     );
// });

export const SubmitAnswer = asyncHandler(async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  console.log("njfvnfvnfnvnfvnfdnvknkdfvd");
  if (!sessionId || !questionId || !answer)
    throw new ApiError(400, "All fields are required");

  const session = await GameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  if (session.status !== "active")
    throw new ApiError(400, "Game is not active");

  if (session.mode !== "team")
    throw new ApiError(400, "Only team mode is supported");

  // =========================
  // 1️⃣ Get current player
  // =========================
  const teamIndex = session.progress.currentTeamIndex;
  const memberIndex = session.teams[teamIndex].currentMemberIndex;
  const currentPlayer = session.teams[teamIndex].members[memberIndex];

  // =========================
  // 2️⃣ Get question from pool
  // =========================
  const questionEntry = session.questionPool.find(
    (q) => q.questionId.toString() === questionId.toString(),
  );

  if (!questionEntry) throw new ApiError(404, "Question not found in pool");

  if (questionEntry.used) throw new ApiError(400, "Question already answered");

  const originalQuestion = await Question.findById(questionId);
  if (!originalQuestion) throw new ApiError(404, "Original question not found");

  // =========================
  // 3️⃣ Check answer
  // =========================
  const isCorrect = originalQuestion.answer === answer;

  // =========================
  // 4️⃣ Record attempt
  // =========================
  currentPlayer.attemptHistory = currentPlayer.attemptHistory || [];
  currentPlayer.attemptHistory.push({
    questionId,
    isCorrect,
  });

  session.markModified(
    `teams.${teamIndex}.members.${memberIndex}.attemptHistory`,
  );

  // =========================
  // 5️⃣ Update score
  // =========================
  applyScoreIfCorrect(
    session,
    teamIndex,
    isCorrect,
    session.progress.currentPointLevel,
  );

  // =========================
  // 6️⃣ Mark question & player used
  // =========================
  markQuestionAndPlayerUsed(questionEntry, currentPlayer);

  // =========================
  // 7️⃣ Rotate turn
  // =========================
  rotateTurn(session);
  session.markModified(`teams.${teamIndex}.currentMemberIndex`);
  session.markModified("progress.currentTeamIndex");
  // =========================
  // 8️⃣ Get next question
  // =========================
  const { status, nextQuestionEntry } = getNextQuestion(session);

  if (!nextQuestionEntry) {
    // Game ended
    session.status = "completed";
    session.completedAt = new Date();

    await session.save();

    // Collect analytics
    let players = [];
    let totalScore = 0;
    let totalQuestionsPlayed = 0;

    session.teams.forEach((team) => {
      totalScore += team.score;

      team.members.forEach((member) => {
        if (member.userId) players.push(member.userId);
        totalQuestionsPlayed += member.attemptHistory?.length || 0;
      });
    });

    const averageScore = players.length > 0 ? totalScore / players.length : 0;

    await GameAnalytics.create({
      sessionId: session._id,
      host: session.host,
      mode: session.mode,
      categories: session.categories,
      players,
      playersCount: players.length,
      totalQuestionsPlayed,
      averageScore,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    });
    const winningScore = Math.max(...session.teams.map((t) => t.score || 0));

    const winningTeams = session.teams.filter((t) => t.score === winningScore);
    const operations = [];
    for (const team of session.teams) {
      const isWinningTeam = winningTeams.some((wt) => wt.name === team.name);

      for (const member of team.members) {
        if (!member.userId) continue;

        const playerScore = member.score || 0;
        const isWin = isWinningTeam;

        const update = {
          $inc: {
            totalGamesPlayed: 1,
            totalScore: playerScore,

            "modes.team.gamesPlayed": 1,
            "modes.team.totalScore": playerScore,

            totalWins: isWin ? 1 : 0,
            totalLosses: isWin ? 0 : 1,

            "modes.team.wins": isWin ? 1 : 0,
            "modes.team.losses": isWin ? 0 : 1,
          },
          $set: {
            lastPlayedAt: new Date(),
          },
          $max: {
            highestScoreEver: playerScore,
            "modes.team.highestScore": playerScore,
          },
        };

        if (isWin) {
          update.$inc.currentWinStreak = 1;
          update.$set.currentLoseStreak = 0;
        } else {
          update.$inc.currentLoseStreak = 1;
          update.$set.currentWinStreak = 0;
        }

        operations.push({
          updateOne: {
            filter: { user: member.userId },
            update,
            upsert: true,
          },
        });
      }
    }
    await PlayerStats.bulkWrite(operations);

    return res.status(200).json(
      new ApiResponse(200, "Game Ended", {
        gameEnded: true,
        teams: session.teams.map((t) => ({
          team: t.name,
          score: t.score,
        })),
      }),
    );
  }

  const nextQuestion = await Question.findById(nextQuestionEntry.questionId);

  if (!nextQuestion) throw new ApiError(404, "Next question not found");

  // =========================
  // 9️⃣ Update progress
  // =========================
  session.progress.currentCategory = nextQuestion.categoryId;
  session.progress.currentPointLevel = nextQuestionEntry.points;
  session.progress.currentQuestionId = nextQuestion._id;

  await session.save();

  // =========================
  // 🔟 Next player info
  // =========================
  const nextTeam = session.teams[session.progress.currentTeamIndex];
  const nextMemberIndex = nextTeam.currentMemberIndex;
  const nextPlayer = nextTeam.members[nextMemberIndex];

  return res.status(200).json(
    new ApiResponse(200, "Answer submitted successfully", {
      isCorrect,
      correctAnswer: originalQuestion.answer,
      pointsAwarded: isCorrect ? originalQuestion.points : 0,
      nextTeam: nextTeam.name,
      nextPlayer,
      nextCategory: session.progress.currentCategory,
    }),
  );
});

// {
//   isCorrect,
//   correctAnswer: question.answer,
//   pointsAwarded: isCorrect ? session.progress.currentPointLevel : 0,
//   turnOver: allAnswered,
//   nextTeam: allAnswered ? session.teams[(currentTeamIndex === 0 ? 1 : 0)].name : null,
// }
export const EndSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user._id;

  const session = await GameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session does not exist");

  if (session.host.toString() !== userId.toString())
    throw new ApiError(403, "You are not authorized to end this session");

  if (session.status === "completed") {
    return res
      .status(400)
      .json(new ApiResponse(200, "Session already completed"));
  }
  session.progress.questionTimer = {
    duration: null,
    startedAt: null,
    expiresAt: null,
  };
  session.status = "completed";
  session.completedAt = new Date();
  await session.save();
  console.log("hi", session.startedAt, session.completedAt);

  /* ===============================
     🧠 CREATE ANALYTICS (SAFE)
  =============================== */

  const existingAnalytics = await GameAnalytics.findOne({
    sessionId: session._id,
  });

  if (!existingAnalytics) {
    let players = [];
    let totalScore = 0;
    let totalQuestionsPlayed = 0;

    if (session.mode === "team") {
      session.teams.forEach((team) => {
        totalScore += team.score;

        team.members.forEach((member) => {
          if (member.userId) players.push(member.userId);
          totalQuestionsPlayed += member.attemptHistory?.length || 0;
        });
      });
    } else {
      if (session.soloPlayer?.userId) {
        players.push(session.soloPlayer.userId);
      }

      totalScore = session.soloPlayer?.score || 0;
      totalQuestionsPlayed = session.soloPlayer?.attemptHistory?.length || 0;
    }

    const averageScore = players.length > 0 ? totalScore / players.length : 0;

    await GameAnalytics.create({
      sessionId: session._id,
      host: session.host,
      mode: session.mode,
      categories: session.categories,
      players,
      playersCount: players.length,
      totalQuestionsPlayed,
      averageScore,
      startedAt: session.startedAt ?? new Date(),
      completedAt: session.completedAt,
    });
    const winningScore = Math.max(...session.teams.map((t) => t.score || 0));

    const winningTeams = session.teams.filter((t) => t.score === winningScore);

    const operations = [];

    for (const team of session.teams) {
      const isWinningTeam = winningTeams.some((wt) => wt.name === team.name);

      for (const member of team.members) {
        if (!member.userId) continue;

        const playerScore = member.score || 0;
        const isWin = isWinningTeam;

        const update = {
          $inc: {
            totalGamesPlayed: 1,
            totalScore: playerScore,

            "modes.team.gamesPlayed": 1,
            "modes.team.totalScore": playerScore,

            ...(isWin && {
              totalWins: 1,
              "modes.team.wins": 1,
              currentWinStreak: 1,
            }),

            ...(!isWin && {
              currentLoseStreak: 1,
            }),
          },

          $set: {
            lastPlayedAt: new Date(),
          },

          $max: {
            highestScoreEver: playerScore,
            "modes.team.highestScore": playerScore,
          },
        };

        if (isWin) {
          update.$set.currentLoseStreak = 0;
        } else {
          update.$set.currentWinStreak = 0;
        }

        operations.push({
          updateOne: {
            filter: { user: member.userId },
            update,
            upsert: true,
          },
        });
      }
    }

    await PlayerStats.bulkWrite(operations);
  }

  /* ===============================
     RETURN RESULT
  =============================== */

  let resultData = {};

  if (session.mode === "team") {
    resultData.teamScores = session.teams.map((team) => ({
      teamName: team.name,
      teamScore: team.score || 0,
      members: (team.members || []).map((member) => ({
        userId: member.userId,
        name: member.username || "Unknown",
        score: member.score || 0,
      })),
    }));
  } else {
    resultData.soloScore = session.soloPlayer?.score || 0;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Session ended successfully", resultData));
});

export const ScoreBoard = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;

  const session = await GameSession.findOne({ sessionCode });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== "completed") {
    throw new ApiError(400, "Game session is not completed yet");
  }

  const [teamA, teamB] = session.teams;

  let winner = null;
  let loser = null;

  if (teamA.score > teamB.score) {
    winner = teamA;
    loser = teamB;
  } else if (teamB.score > teamA.score) {
    winner = teamB;
    loser = teamA;
  } // else: It's a tie

  return res.status(200).json(
    new ApiResponse(200, "Scoreboard fetched successfully", {
      teams: session.teams.map((t) => ({
        name: t.name,
        score: t.score,
        members: t.members,
      })),
      winner: winner
        ? { name: winner.name, score: winner.score, members: winner.members }
        : null,
      loser: loser
        ? { name: loser.name, score: loser.score, members: loser.members }
        : null,
      isDraw: teamA.score === teamB.score,
    }),
  );
});
