import { z } from "zod";
import { imageField } from ".";

export const QuestionSchema = z
  .object({
    categoryId: z.string().min(1, "Category is required"),
    questionText: z.string().min(1, "Question text is required"),
    answer: z.string().min(1, "Answer is required"),
    points: z.coerce.number().refine((val) => [200, 400, 600].includes(val), {
      message: "Invalid point value",
    }),
    options: z.array(z.string()).length(4, "There must be exactly 4 options"),
    questionImage: imageField,

    answerImage: imageField
  })
  .refine((data) => data.options.includes(data.answer), {
    path: ["answer"],
    message: "Answer must be one of the options",
  });
export type QuestionValues = z.infer<typeof QuestionSchema>;
