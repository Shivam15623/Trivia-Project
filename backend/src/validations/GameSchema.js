import * as yup from "yup";
export const createGameSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  categories: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[0-9a-fA-F]{24}$/,
          "Each category must be a valid MongoDB ObjectId"
        )
    )
    .required("Categories are required")
    .min(6, "You must provide exactly 6 categories")
    .max(6, "You must provide exactly 6 categories"),
});



