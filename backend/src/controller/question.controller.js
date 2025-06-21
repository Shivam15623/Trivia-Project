import { response } from "express";
import Category from "../model/categorie.model.js";
import Question from "../model/questionAnswer.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";
import { fetchQuestionsForOneCategory } from "../helper/fetchrandomquestion.js";
export const addQuestionToCategory = asyncHandler(async (req, res) => {
  const { categoryId, points, questionText, answer, options } = req.body;



  // Ensure all required fields are present
  if (
    !categoryId ||
    !points ||
    !questionText ||
    !answer ||
    !options ||
    options.length !== 4
  ) {
    throw new ApiError(
      400,
      "All fields are required and there must be exactly 4 options."
    );
  }

  const numericPoint = parseInt(points, 10);

  // Handling image uploads for both question and answer images
  const questionImagepath = req.files?.questionImage?.[0]?.path; // Assuming file uploads come from `req.files`
  const answerImagepath = req.files?.answerImage?.[0]?.path; // For the answer image

  // Validate if the question image is present
  if (!questionImagepath) {
    throw new ApiError(400, "Question image file is missing");
  }

  // Upload question image to Cloudinary
  const questionImage = await uploadOnCloudinary(questionImagepath);
  if (!questionImage.url) {
    throw new ApiError(
      500,
      "Error while uploading question image to Cloudinary"
    );
  }

  // Upload answer image if provided
  const answerImage = answerImagepath
    ? await uploadOnCloudinary(answerImagepath)
    : null;
  const answerImageUrl = answerImage ? answerImage.url : null;

  // Find the category associated with the question
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category Not Found");
  }

  // Ensure that the answer exists in the provided options
  if (!options.includes(answer)) {
    throw new ApiError(400, "Answer must be one of the provided options.");
  }

  // Create the question document with both images and options
  const question = await Question.create({
    questionText,
    answer,
    points: numericPoint,
    options: options, // Store the options array
    questionImage: questionImage.url, // Store the question image URL
    answerImage: answerImageUrl, // Store the answer image URL (can be null)
    categoryId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Question Added Successfully"));
});

export const getQuestionsByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const catagory = await Category.findOne({ slug: slug });
  if (!catagory) {
    throw new ApiError(404, "Category Not Found");
  }
  const allQuestions = await fetchQuestionsForOneCategory(catagory._id);
  if (
    !allQuestions ||
    Object.values(allQuestions).every((questions) => questions.length === 0)
  ) {
    throw new ApiError(404, "No Questions found for this category");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `all questions for category ${catagory.name}`,
        allQuestions
      )
    );
});
export const updateQuestion = asyncHandler(async (req, res) => {
  const { points, questionText, answer, categoryId } = req.body;

  // Check if all required fields are present
  if (!categoryId || !points || !questionText || !answer) {
    throw new ApiError(400, "All fields are required");
  }
 

  const imagesPath = {};
  if (req.files?.questionImage?.[0]?.path) {
    const questionImagepath = req.files.questionImage[0].path; // Assuming file uploads come from `req.files`
    const questionImage = await uploadOnCloudinary(questionImagepath);
    if (!questionImage.url) {
      imagesPath.questionImage = null; // If upload fails, set to null
    }
    imagesPath.questionImage = questionImage.url; // Store the question image URL
  }
  if (req.files?.answerImage?.[0]?.path) {
    const answerImagepath = req.files.answerImage[0].path; // For the answer image
    const answerImage = await uploadOnCloudinary(answerImagepath);
    if (!answerImage.url) {
      imagesPath.answerImage = null; // If upload fails, set to null
    }
    imagesPath.answerImage = answerImage.url; // Store the answer image URL
  }

  // Get the questionId from request parameters
  const { questionId } = req.params;

  // Find the question by its ID
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question Not Found");
  }

  // Update the question with new data
  question.points = points;
  question.questionText = questionText;
  question.answer = answer;
  question.categoryId = categoryId;
  if (imagesPath.questionImage) {
    question.questionImage = imagesPath.questionImage; // Update question image if provided
  }
  if (imagesPath.answerImage) {
    question.answerImage = imagesPath.answerImage; // Update answer image if provided
  }

  // Save the updated question
  await question.save();

  // Return the updated question
  return res
    .status(200)
    .json(new ApiResponse(200, "Question Details Updated Successfully"));
});
export const deleteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question Not Found");
  }
  await question.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, "Question deleted successfully"));
});

export const fetchQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Question fetched successfully", question));
});
