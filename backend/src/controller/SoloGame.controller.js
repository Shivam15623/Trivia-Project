import { applyScoreIfCorrectSolo } from "../helper/applyScoreIfCorrect.js";
import { getNextQuestionSolo } from "../helper/getNextQuestion.js";
import { getQuestionFromPool } from "../helper/getQuestionFromPool.js";
import { GenerateQuestionpoolSolo } from "../helper/questionpool.js";
import Game from "../model/Game.model.js";
import { evaluateAnswer } from "../helper/evaluateAnswer.js";
import Question from "../model/questionAnswer.model.js";
import { SoloGameSession } from "../model/SoloGameSession.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
export const initializeGame = asyncHandler(async (req, res) => {
  const { gameId } = req.body;
  const userId = req.user._id;
  const username = req.user.firstname;

  if (!gameId) {
    throw new ApiError(400, "All fields are required");
  }
  const GameFind = await Game.findById(gameId);
  if (!GameFind) {
    throw new ApiError(404, "No Such Game Exist");
  }
  if (GameFind.createdBy.toString() !== userId.toString()) {
    throw new ApiError(400, "UnAuthorized User");
  }
  const SoloSession = await SoloGameSession.create({
    gameId: gameId,
    userId: userId,
    username: username,
    status: "waiting",
    score: 0,
  });
  if (!SoloSession) {
    throw new ApiError(500, "Server side error");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Session Created Successfully", SoloSession._id)
    );
});
export const startSologame = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new ApiError(400, "sessionId is not provided");
  }
  const session = await SoloGameSession.findById(sessionId).populate("gameId");
  if (!session) {
    throw new ApiError(404, "No Such session Exist");
  }
  if (session.status === "active") {
    throw new ApiError(400, "Game Started Already");
  }
  const categories = session.gameId.categories;
  const pool = await GenerateQuestionpoolSolo(categories);
  session.questionPool = pool;
  session.progress.currentCategory = null;
  session.progress.currentPointLevel = 200;
  const currentQuestionEntry = session.questionPool.find(
    (q) => !q.used && q.points === session.progress.currentPointLevel
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
  session.progress.currentCategory = currentQuestion.categoryId;
  session.progress.currentPointLevel = currentQuestionEntry.points;
  session.progress.currentQuestionId = currentQuestion._id;
  session.usedCategories = [];
  await session.save();
  session.status = "active";
  session.startedAt = new Date(); // Set the start time
  await session.save();
  return res.status(200).json(
    new ApiResponse(200, "Game started successfully", {
      sessionId: session._id,
      status: session.status,
    })
  );
});
export const endSoloGame = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user._id;

  const session = await SoloGameSession.findById(sessionId);

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
export const SubmitAnswerSolo = asyncHandler(async (req, res) => {
  const { sessionId, questionId, answer } = req.body;
  
  const session = await SoloGameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session does not exist");
  if (session.status !== "active") {
    throw new ApiError(400, "Session is not active");
  }
  const questionEntry = getQuestionFromPool(session, questionId);
  if(questionEntry.used===true){
    throw new ApiError(400,"Question Already Answered")
  }
  const originalQuestion = await Question.findById(questionId);
  if (!originalQuestion) throw new ApiError(404, "Original question not found");
  // 3. Check answer
  const isCorrect = evaluateAnswer(originalQuestion.answer, answer);
  session.attemptHistory.push({
    questionId: questionId,
    isCorrect: isCorrect,
  });
  session.markModified("attemptHistory");
  await session.save();
  applyScoreIfCorrectSolo(
    session,
    isCorrect,
    session.progress.currentPointLevel
  );
  questionEntry.used = true;
  const { status, nextQuestionEntry } = getNextQuestionSolo(session);
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
          score: session.score,
          username: session.username,
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
  await session.save()
  return res.status(200).json(
    new ApiResponse(200, "Answer submitted successfully", {
      isCorrect,
      correctAnswer: originalQuestion.correctAnswer,
      pointsAwarded: isCorrect ? originalQuestion.points : 0,
    })
  );
});
export const CurrentQuestionSolo = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await SoloGameSession.findById(sessionId);
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
    AnswerImage: currentQuestion.answerImage,
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
export const SoloSessionInfo = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
 

  const session = await SoloGameSession.findById(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Session fetched successfully", session));
});
