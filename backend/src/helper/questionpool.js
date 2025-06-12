import Question from "../model/questionAnswer.model.js";
export const generateQuestionPool = async ({
  categories = [],
  questionsPerTeam = 2,
}) => {
  const pointsArray = [200, 400, 600]; // Points levels for each question
  const pool = [];

  // Loop through each category
  for (const category of categories) {
    // For each category, fetch 2 questions for each point level (200, 400, 600)
    for (const point of pointsArray) {
      const questions = await Question.aggregate([
        {
          $match: {
            categoryId: category, // Match questions for the current category
            points: point, // Match questions for the current point value
          },
        },
        { $sample: { size: questionsPerTeam } }, // Get 2 random questions for each point level
      ]);

      // If there are not enough questions, throw an error
      if (questions.length < questionsPerTeam) {
        throw new Error(
          `Not enough questions for ${point} points in category ${category}`
        );
      }

      // Alternate assignment: even index = team 0, odd = team 1
      questions.forEach((q, i) => {
        pool.push({
          category: q.categoryId,
          points: q.points,
          teamIndex: i % 2, // Alternate teams: team 0, team 1
          questionId: q._id,
          used: false,
        });
      });
    }
  }

  return pool; // Return the generated pool of questions
};

export const GenerateQuestionpoolSolo = async (categories = []) => {
  const pointsArray = [200, 400, 600]; // Points levels for each question
  const pool = [];
  for (const category of categories) {
    // For each category, fetch 2 questions for each point level (200, 400, 600)
    for (const point of pointsArray) {
      const questions = await Question.aggregate([
        {
          $match: {
            categoryId: category, // Match questions for the current category
            points: point, // Match questions for the current point value
          },
        },
        { $sample: { size: 1 } }, // Get 2 random questions for each point level
      ]);
      questions.forEach((q, i) => {
        pool.push({
          category: q.categoryId,
          points: q.points,

          questionId: q._id,
          used: false,
        });
      });
    }
  }
  return pool;
};
