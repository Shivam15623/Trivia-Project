import { ApiResponse } from "./GenericResponse";

export interface Question {
  _id: string;
  questionText: string;
  categoryId: string;
  answer: string;
  points: 200 | 400 | 600;
  questionImage: string;
  answerImage: string;
  options: string[];
}
export interface QuestionsByPoints {
  200: Question[];
  400: Question[];
  600: Question[];
}
export type getQuestionDetailByIdResponse = ApiResponse<Question>;
export interface QuestionCredentials {
  questionText: string;
  categoryId: string;
  answer: string;
  points: 200 | 400 | 600;
  options: string[];
}
export type GetQuestionsByCategoryResponse = ApiResponse<QuestionsByPoints>;
