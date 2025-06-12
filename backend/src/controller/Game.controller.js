import { fetchRandomQuestions } from "../helper/fetchrandomquestion.js";
import Game from "../model/Game.model.js";

import User from "../model/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";

export const createGamebyUser = asyncHandler(async (req, res) => {
  const { title, categories } = req.body;
  const userId = req.user._id;

  // Basic Validations
  if (!title) {
    throw new ApiError(400, "Title and templateId are required.");
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new ApiError(400, "Categories must be a non-empty array.");
  }

  if (categories.length !== 6) {
    throw new ApiError(400, `Expected 6 categories as per the GAme.`);
  }

  // Create Game for User (Fixed values)
  const gameCreated = await Game.create({
    title,
    categories,
    createdBy: userId,
  });

  // Update user's MyGames list
  await User.findByIdAndUpdate(userId, {
    $push: { MyGames: gameCreated._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Game created successfully", gameCreated));
});
export const getGameById = asyncHandler(async (req, res) => {
  const { gameId } = req.params;

  const game = await Game.findById(gameId).populate(
    "categories",
    "_id name thumbnail"
  ); // optional: to also get category names

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const perPointCount = 2;

  const questionsByCategory = {};

  for (const category of game.categories) {
    questionsByCategory[category._id] = await fetchRandomQuestions(
      category._id,
      perPointCount
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "GameData fetched Successfully", {
      gameId: game._id,
      title: game.title,
      type: game.type,
      categories: game.categories,
      questions: questionsByCategory, // 👉 organized by category and point
    })
  );
});

export const GetGameCreatedByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate(
    "MyGames",
    "title createdAt  _id"
  );
  if (!user) {
    throw new ApiError(404, "No Such User Exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Games fetched successfully", user.MyGames));
});
export const getAllGamesByUserRegular = asyncHandler(async (req, res) => {});
