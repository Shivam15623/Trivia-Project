import Question from "../model/questionAnswer.model.js";

/**
 * Generate a question pool for a game session
 * 
 * @param {Object} options
 * @param {Array} options.categories - array of category IDs
 * @param {Number} options.questionsPerTeam - number of questions per team per point level (used in team mode)
 * @param {String} options.mode - "team" | "solo" | "timed_solo"
 * @returns {Array} pool of questions
 */
export const generateQuestionPool = async ({
  categories = [],
  questionsPerTeam = 2,
  mode = "team",
}) => {
  const pointsArray = [200, 400, 600];
  const pool = [];

  for (const category of categories) {
    for (const point of pointsArray) {
      // Decide how many questions to fetch
      const size = mode === "team" ? questionsPerTeam : 1;

      const questions = await Question.aggregate([
        {
          $match: {
            categoryId: category,
            points: point,
          },
        },
        { $sample: { size } },
      ]);

      if (questions.length < size) {
        throw new Error(
          `Not enough questions for ${point} points in category ${category}`
        );
      }

      questions.forEach((q, i) => {
        const questionEntry = {
          category: q.categoryId,
          points: q.points,
          questionId: q._id,
          used: false,
        };

        // Only assign teamIndex if mode is team
        if (mode === "team") {
          questionEntry.teamIndex = i % 2; // alternate between team 0 and team 1
        }

        pool.push(questionEntry);
      });
    }
  }

  return pool;
};
