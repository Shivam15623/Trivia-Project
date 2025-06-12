import Category from "../model/categorie.model.js";

import { uploadOnCloudinary } from "../utills/cloudinary.js";

import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import { fetchQuestionsForPublicValidate } from "../helper/fetchrandomquestion.js";
import {  getTop6Categories } from "../helper/DashboardHelpers.js";
import Game from "../model/Game.model.js";

// Create Category
export const createCategory = asyncHandler(async (req, res) => {


  const { name, description } = req.body;

  const thumbnailPath = req?.file?.path;
  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  if (!thumbnail?.url) {
    throw new ApiError(500, "Thumbnail upload failed");
  }

  const category = await Category.create({
    name,
    description,

    thumbnail: thumbnail.url,

    isPublic: false,
    createdBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "New category created successfully", category));
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const allCategories = await Category.find();
  if (!allCategories) {
    throw new ApiError(400, "No Categories Found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All Categories Fetched Successfully", allCategories)
    );
});
export const getAllCategoriesPublic = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({ isPublic: true });
  if (!allCategories) {
    throw new ApiError(400, "No Categories Found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All Categories Fetched Successfully", allCategories)
    );
});
export const fetchCategoryDetails = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const categoryDetails = await Category.findOne({ slug: slug });
  if (!categoryDetails) {
    throw new ApiError(404, "No Category Found ");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Category Details Fetched Successfully",
        categoryDetails
      )
    );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  // 🛑 Validate inputs
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // ✅ Prepare updated data
  const updatedData = {
    name: name || categoryExists.name,
    description: description || categoryExists.description,
  };

  // 📤 Upload new thumbnail only if provided
  if (req?.file?.path) {
    const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
    if (!uploadedThumbnail?.url) {
      throw new ApiError(500, "Thumbnail upload failed");
    }
    updatedData.thumbnail = uploadedThumbnail.url;
  }

  // 🛠 Update the category
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updatedData,
    { new: true } // return the updated doc
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Category updated successfully", updatedCategory)
    );
});

export const CategoriesFetch = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isPublic: true }).select(
    "name thumbnail"
  );
  
  if (!categories) {
    throw new ApiError(400, "No Categories Found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All Categories Fetched Successfully", categories)
    );
});
export const PublicToggle = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "No such category exists");
  }

  // If making it public, validate the category first
  if (!category.isPublic) {
    const pointwiseQuestions = await fetchQuestionsForPublicValidate(
      categoryId
    );
    const isValid = await pointwiseCheck(pointwiseQuestions);

    if (!isValid) {
      throw new ApiError(
        400,
        "Category must have at least 2 questions each for 200, 400, and 600 points before making it public."
      );
    }
  }

  // Toggle public/private
  category.isPublic = !category.isPublic;
  await category.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Category visibility updated to ${
          category.isPublic ? "Public" : "Private"
        }`
      )
    );
});

const pointwiseCheck = async (pquestions) => {
  try {
    return (
      pquestions[200]?.length >= 2 &&
      pquestions[400]?.length >= 2 &&
      pquestions[600]?.length >= 2
    );
  } catch (error) {
    console.error("Pointwise check failed:", error);
    return false;
  }
};

export const DashboardCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new ApiError(400, "Categories are empty");
  }

  const totalActiveCategories = categories.filter(cat => cat.isPublic).length;
  const totalInactiveCategories = categories.length - totalActiveCategories;

  const topCategories = await getTop6Categories(); // already includes usage counts

  // 🟩 Recently added categories
  const recentlyAddedCategories = await Category.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name createdAt thumbnail");
    // const mostplayedCategories=await getMostPlayedCategories()

  // 📊 Monthly category usage (optional - returns categories used this month)
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const categoryUsageThisMonth = await Game.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $unwind: "$categories" },
    {
      $group: {
        _id: "$categories",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 0,
        categoryId: "$category._id",
        name: "$category.name",
        thumbnail: "$category.thumbnail",
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  const responsePayload = {
    totalCategories: categories.length,
    totalActiveCategories,
    totalInactiveCategories,
    topCategories,
    recentlyAddedCategories,
    monthlyTopUsedCategories: categoryUsageThisMonth,
    
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Dashboard data fetched successfully",
        responsePayload
      )
    );
});

export const deleteCategory = asyncHandler(async (req, res) => {});
