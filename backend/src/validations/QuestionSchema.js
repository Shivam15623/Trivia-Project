import yup from "yup";
export const QuestionSchema = yup.object({
  questionText: yup.string().required("Question text is required"),
  answer: yup.string().required("Answer is required"),
  categoryId: yup.string().required("Category ID is required"),
  points: yup
    .number()
    .oneOf(
      [200, 400, 600],
      "Point must be one of the following values:200,400,600"
    ),
  options: yup
    .array()
    .of(yup.string().required("Option is required"))
    .min(4, "There must be at least 4 options")
    .max(4, "There must be at most 4 options"),
});
