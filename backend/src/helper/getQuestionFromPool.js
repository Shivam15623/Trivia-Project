import { ApiError } from "../utills/ApiError.js";

export const getQuestionFromPool = (session, questionId) => {
    const questionEntry = session.questionPool.find(
      (q) => q.questionId.toString() === questionId
    );
    if (!questionEntry) {
      throw new ApiError(400, "Question not found in pool");
    }
    return questionEntry;
  };
  