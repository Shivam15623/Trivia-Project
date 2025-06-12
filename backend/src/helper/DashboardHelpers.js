import Game from "../model/Game.model.js";
import { GameSession } from "../model/GameSession.model.js";


export const getTop6Categories = async () => {
  const topCategories = await Game.aggregate([
    { $unwind: "$categories" },
    {
      $group: {
        _id: "$categories", // category ObjectId
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: "categories", 
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" }, // flatten the populated category
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        name: "$category.name",
        count: 1,
      },
    },
  ]);

  return topCategories;
};
export const getMostPlayedCategories = async () => {
    try {
      const mostPlayedCategories = await GameSession.aggregate([
        // Match only completed or active games
        {
          $match: {
            status: { $in: ["active", "completed"] },
          },
        },
        // Unwind the usedCategories to count each one individually
        { $unwind: "$usedCategories" },
        // Group by category and count the occurrences
        {
          $group: {
            _id: "$usedCategories", // Group by category ID
            count: { $sum: 1 }, // Count how many times each category was used
          },
        },
        // Lookup to get the category details
        {
          $lookup: {
            from: "categories", // Join with the categories collection
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        // Unwind the category details to access them easily
        { $unwind: "$categoryDetails" },
        // Project the category name and count
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            categoryName: "$categoryDetails.name",
            count: 1,
          },
        },
        // Sort by count to get the most used categories first
        { $sort: { count: -1 } },
        // Limit to top 6 categories
        { $limit: 6 },
      ]);
  
      return mostPlayedCategories;
    } catch (error) {
      console.error("Error fetching most played categories:", error);
      throw error;
    }
  };