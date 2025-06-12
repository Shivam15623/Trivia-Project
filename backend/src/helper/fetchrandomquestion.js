import mongoose from "mongoose";
import Question from "../model/questionAnswer.model.js";

const pointsArray = [200, 400, 600];

export const fetchRandomQuestions = async (categoryId, perPointCount) => {
  const promises = pointsArray.map((point) =>
    Question.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId),
          points: point,
        },
      },
      { $sample: { size: perPointCount } },
      { $project: { _id: 1 } },
    ])
  );

  const results = await Promise.all(promises);

  return {
    200: results[0],
    400: results[1],
    600: results[2],
  };
};
export const fetchQuestionsForPublicValidate=async(categoryId)=>{
  const promises = pointsArray.map((point) =>
    Question.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId),
          points: point,
        },
      },
      
      { $project: { _id: 1 } },
    ])
  );

  const results = await Promise.all(promises);

  return {
    200: results[0],
    400: results[1],
    600: results[2],
  };
}
export const fetchQuestionsForOneCategory = async (categoryId) => {
  const promises = pointsArray.map((point) =>
    Question.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId),
          points: point,
        },
      },
      {
        $project: {
          _id: 1,
          questionText: 1,
          answer: 1,
          options: 1,
          questionImage: 1,
          answerImage: 1,
        },
      },
    ])
  );
  const results = await Promise.all(promises);
  return {
    200: results[0],
    400: results[1],
    600: results[2],
  };
};
