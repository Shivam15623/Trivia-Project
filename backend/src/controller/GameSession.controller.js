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
import { applyScoreIfCorrect } from "../helper/applyScoreIfCorrect.js";
import { markQuestionAndPlayerUsed } from "../helper/markQuestionAndPlayerUsed.js";
import { rotateTurn } from "../helper/rotateTurn.js";
import { customAlphabet } from "nanoid";
import { getNextQuestion } from "../helper/getNextQuestion.js";
import { finalizeProgress } from "../helper/finalizeProgress.js";
import { io } from "../index.js";
const generateCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
export const StartSession = asyncHandler(async (req, res) => {
  const {
    gameId,
    teamAName,
    teamBName,
    teamAmembers,
    teamBmembers,
    socketId,
    hostTeam,
  } = req.body;

  if (
    !teamAName ||
    !teamBName ||
    !teamAmembers ||
    !teamBmembers ||
    !hostTeam ||
    !socketId ||
    !gameId
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const hostId = req.user._id;

  const hostName = req.user.firstname;
  const existgame = await Game.findById(gameId);
  if (!existgame) throw new ApiError(400, "No Such Game Found");

  if (existgame.createdBy.toString() !== hostId.toString()) {
    throw new ApiError(403, "You are unauthorized to start this game");
  }
  const hostPlayer = {
    userId: hostId,
    username: hostName,
    socketId: socketId,
  };
  const TeamA = {
    name: teamAName,
    expectedMembers: teamAmembers,
    members: [], // initially empty
  };
  const TeamB = {
    name: teamBName,
    expectedMembers: teamBmembers,
    members: [],
  };
  if (hostTeam === "A") {
    TeamA.members.push(hostPlayer);
  } else if (hostTeam === "B") {
    TeamB.members.push(hostPlayer);
  } else {
    throw new ApiError(400, "Invalid host team selection");
  }

  const sessionCode = "SESSION-" + generateCode();

  const newSession = new GameSession({
    sessionCode,
    host: hostId,
    gameId,
    status: "waiting",
    teams: [TeamA, TeamB],
  });

  await newSession.save();

  return res.status(200).json(
    new ApiResponse(200, "Game session created successfully", {
      sessionCode,
      sessionId: newSession._id,
    })
  );
});
export const getSessionInfo = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;

  const session = await GameSession.findOne({ sessionCode });
  if (!session) throw new ApiError(404, "Session not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Session fetched successfully", session));
});
export const getWaitingRoomInfo = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;

  const session = await GameSession.findOne({ sessionCode });
  if (!session) throw new ApiError(404, "Session not found");

  const teamInfo = session.teams.map((team) => ({
    name: team.name,
    expectedMembers: team.expectedMembers,
    currentMembers: team.members.length,
    members: team.members,
  }));

  return res.status(200).json(
    new ApiResponse(200, "Session fetched successfully", {
      sessionId: session._id,
      sessionCode: session.sessionCode,
      status: session.status,
      teams: teamInfo,
      host: session.host,
      gameId: session.gameId,
    })
  );
});
export const joinSession = asyncHandler(async (req, res) => {
  const { sessionCode, teamName, socketId } = req.body;

  if (!sessionCode || !teamName || !socketId) {
    throw new ApiError(400, "All fields are required");
  }

  const session = await GameSession.findOne({ sessionCode });

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== "waiting") {
    throw new ApiError(400, "Session is not joinable at this time");
  }
  // Check if the team exists in the session
  const team = session.teams.find((team) => team.name === teamName);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }
  const isUserInAnyTeam = session.teams.some((team) =>
    team.members.some((m) => m.userId.toString() === req.user._id.toString())
  );

  if (isUserInAnyTeam) {
    throw new ApiError(409, "User already exists in a team");
  }
  // Check if the team has space for more members
  if (team.members.length >= team.expectedMembers) {
    throw new ApiError(400, "Team is already full");
  }

  // Add the user to the team
  team.members.push({
    userId: req.user._id,
    username: req.user.firstname,
    socketId,
  });

  // Save the session after modifying it
  await session.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Joined team successfully", session));
});

export const startPlayMatch = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;


  const session = await GameSession.findById(sessionId).populate("gameId");

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the host can start the game");
  }

  // Ensure the game is not already started
  if (session.status === "active") {
    throw new ApiError(400, "Game has already started");
  }
  const categories = session.gameId.categories; // assuming game defines categories
  const pool = await generateQuestionPool({ categories, questionsPerTeam: 2 });

  // Store in session
  session.questionPool = pool;

  // Randomly assign the first team to answer
  const currentTeamIndex = Math.random() > 0.5 ? 0 : 1; // Randomize first team (0 or 1)

  // Initialize round-robin tracking data in the progress schema
  session.progress.currentTeamIndex = currentTeamIndex;
  session.progress.currentCategory = null; // No category selected at the start
  session.progress.currentPointLevel = 200; // Starting from 200 points
  session.progress.currentStep = 0; // Step 0 means it's Team A's turn to answer

  // Initialize aids and member status
  session.teams[currentTeamIndex].currentMemberIndex = 0;
  session.teams[currentTeamIndex].members.forEach((member) => {
    member.hasAnswered = false;
  });

  // Select the first question from the pool
  const currentQuestionEntry = session.questionPool.find(
    (q) =>
      !q.used &&
      q.teamIndex === currentTeamIndex &&
      q.points === session.progress.currentPointLevel
  );
  if (!currentQuestionEntry) {
    throw new ApiError(400, "No available questions for this team");
  }

  const currentQuestion = await Question.findById(
    currentQuestionEntry.questionId
  ); // Assuming 'Question' is your question model
  if (!currentQuestion) {
    throw new ApiError(404, "Question not found");
  }

  // Update the session's progress and mark the question as used
  session.progress.currentCategory = currentQuestion.categoryId;
  session.progress.currentPointLevel = currentQuestionEntry.points;
  session.progress.currentQuestionId = currentQuestion._id;

  session.usedCategories = [];
  await session.save();

  // Update session status to active
  session.status = "active";
  session.startedAt = new Date(); // Set the start time
  await session.save();
  io.to(session.sessionCode).emit("game-started", {
    message: "Game has started!",
  });

  return res.status(200).json(
    new ApiResponse(200, "Game started successfully", {
      sessionCode: session.sessionCode,
      sessionId: session._id,
      status: session.status,
    })
  );
});

export const currentQuestion = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;
  const session = await GameSession.findOne({ sessionCode });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }
  if (session.status !== "active") {
    throw new ApiError(400, "Game session is not active");
  }
  const currentQuestion = await Question.findById(
    session.progress.currentQuestionId
  ).populate("categoryId", "_id name thumbnail");
  if (!currentQuestion) {
    throw new ApiError(404, "Question not Found");
  }
  const currentQuestionresponse = {
    questionId: currentQuestion._id,
    points: currentQuestion.points,
    QuestionImage: currentQuestion.questionImage,
    questionText: currentQuestion.questionText,
    answerImage: currentQuestion.answerImage,
    options: currentQuestion.options,
    Answer: currentQuestion.answer,
    category: {
      id: currentQuestion.categoryId._id,
      name: currentQuestion.categoryId.name,
      thumbnail: currentQuestion.categoryId.thumbnail,
    },
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "current Question fetched Successfully",
        currentQuestionresponse
      )
    );
});

export const FiftyFiftyAid = asyncHandler(async (req, res) => {
  const { gameSessionId, teamIndex, questionId } = req.body;
  const userId = req.user._id;

  const session = await GameSession.findById(gameSessionId);
  const player = session.teams[teamIndex].members.find(
    (p) => p.userId.toString === userId.toString
  );

  if (!player) {
    throw new ApiError(404, "player Not Found in Team");
  }
  if (player.aids.fiftyFiftyUsed) {
    throw new ApiError(400, "the Aid is already Used");
  }
  const question = await Question.findById(questionId);
  const correct = question.answer;
  const incorrectOptions = question.options.filter((o) => o !== correct);
  const randomWrong =
    incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];

  // Mark aid as used
  player.aids.fiftyFiftyUsed = true;
  await session.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, "50/50 Used Successfully", [correct, randomWrong])
    );
});

export const SubmitAnswer = asyncHandler(async (req, res) => {
  const { sessionId, questionId, answer, aid } = req.body;
  if (!sessionId || !questionId || !answer) {
    throw new ApiError(400, "all fields are required");
  }
  if (aid && !["Deduct", "None", "twicePoint"].includes(aid)) {
    throw new ApiError(400, "Invalid aid value");
  }

  // 1. Find session and validate turn
  const session = await GameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session does not exist");

  const { currentTeam, currentPlayer, currentTeamIndex } =
    await validateSession(session, req.user._id);
  const currentMemberIndex = currentTeam.currentMemberIndex;
  if (aid !== "None") {
    const aids =
      session.teams[currentTeamIndex].members[currentMemberIndex].aids;

    const aidUsageMap = {
      Deduct: "deductUsed",
      twicePoint: "twicePointUsed",
    };

    const aidKey = aidUsageMap[aid];
    if (aidKey && aids[aidKey]) {
      throw new ApiError(400, `${aid} aid has already been used`);
    }
  }


  // 2. Get original question
  const questionEntry = getQuestionFromPool(session, questionId);

  if (questionEntry.used === true) {
    throw new ApiError(400, "Question Already Answered");
  }
  const originalQuestion = await Question.findById(questionId);
  if (!originalQuestion) throw new ApiError(404, "Original question not found");

  // 3. Check answer
  const isCorrect = evaluateAnswer(originalQuestion.answer, answer);

  session.teams[currentTeamIndex].members[
    currentMemberIndex
  ].attemptHistory.push({
    questionId: questionId,
    isCorrect: isCorrect,
  });
  session.markModified(
    `teams.${currentTeamIndex}.members.${currentMemberIndex}.attemptHistory`
  );
  await session.save();

  // 4. Update score if correct
  applyScoreIfCorrect(
    session,
    currentTeamIndex,
    isCorrect,
    session.progress.currentPointLevel,
    aid
  );
  if (aid === "Deduct" && isCorrect) {
    const opposingTeamIndex = currentTeamIndex === 0 ? 1 : 0;
    session.teams[opposingTeamIndex].score -=
      session.progress.currentPointLevel;
    session.markModified(`teams.${opposingTeamIndex}.score`);
    await session.save();
  }
  if (aid !== "None") {
    const aidUsageMap = {
      Deduct: "deductUsed",
      twicePoint: "twicePointUsed",
    };

    const aidKey = aidUsageMap[aid];
    if (aidKey) {
      session.teams[currentTeamIndex].members[currentMemberIndex].aids[
        aidKey
      ] = true;
      session.markModified(
        `teams.${currentTeamIndex}.members.${currentMemberIndex}.aids.${aidKey}`
      );
    }
  }

  // 5. Mark used flags
  markQuestionAndPlayerUsed(questionEntry, currentPlayer);

  // 6. Rotate to next player and team
  rotateTurn(session);

  // 7. Get next question
  const { status, nextQuestionEntry } = getNextQuestion(session);

  if (status === "ended") {
    session.status = "completed";
    await session.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        isCorrect
          ? "Correct answer! Game Ended"
          : "Incorrect answer  Game Ended",

        {
          gameEnded: true,
          teams: session.teams.map((t) => ({
            team: t.name,
            score: t.score,
          })),
        }
      )
    );
  }

  const nextQuestion = await Question.findById(nextQuestionEntry.questionId);
  if (!nextQuestion) throw new ApiError(404, "Next question not found");

  // 8. Finalize session progress
  session.progress.currentCategory = nextQuestion.categoryId;
  session.progress.currentPointLevel = nextQuestionEntry.points;
  session.progress.currentQuestionId = nextQuestion._id;
  await finalizeProgress(session, currentTeamIndex);
  const nextplayerindex =
    session.teams[session.progress.currentTeamIndex].currentMemberIndex;
  const nextplayer =
    session.teams[session.progress.currentTeamIndex].members[nextplayerindex];

  // 9. Send response
  return res.status(200).json(
    new ApiResponse(200, "Answer submitted successfully", {
      isCorrect,
      correctAnswer: originalQuestion.correctAnswer,
      pointsAwarded: isCorrect ? originalQuestion.points : 0,
      nextTeam: session.teams[session.progress.currentTeamIndex].name,
      nextplayer: nextplayer,
      nextcategory:
        originalQuestion.categoryId === session.progress.currentCategory
          ? null
          : session.progress.currentCategory,
      socketCode: session.socketCode,
    })
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

  if (!session) {
    throw new ApiError(404, "Session does not exist");
  }

  if (session.host.toString() !== userId.toString()) {
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

    const teamScores = session.teams.map((team) => ({
      teamName: team.name,
      teamScore: team.score || 0,
      members: (team.members || []).map((member) => ({
        userId: member.userId,
        name: member.username || "Unknown",
        score: member.score || 0,
      })),
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, "Session ended successfully"));
  }

  if (session.status === "waiting") {
    session.status = "completed";
    await session.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Session was waiting, now marked as completed")
      );
  }

  throw new ApiError(400, "Invalid session status");
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
      })),
      winner: winner
        ? { name: winner.name, score: winner.score, members: winner.members }
        : null,
      loser: loser
        ? { name: loser.name, score: loser.score, members: loser.members }
        : null,
      isDraw: teamA.score === teamB.score,
    })
  );
});
