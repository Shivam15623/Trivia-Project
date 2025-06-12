import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import { api } from "../redux/ApiSlice/apiSlice";
import {
  getQuestionDetailByIdResponse,
  GetQuestionsByCategoryResponse,
} from "@/interfaces/QuestionInterface";

export const QuestionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    FetchQuestionsbyCategory: builder.query<
      GetQuestionsByCategoryResponse,
      string
    >({
      query: (categoryId) => ({
        url: `/api/v1/question/getQuestionsByCategory/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
    AddQuestiontoCategory: builder.mutation<ApiGeneralResponse, FormData>({
      query: (FormData) => ({
        url: "/api/v1/question/AddQuestion",
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Questions"],
    }),
    UpdateQuestion: builder.mutation<
      ApiGeneralResponse,
      { formData: FormData; questionId: string }
    >({
      query: ({ questionId, formData }) => ({
        url: `/api/v1/question/updateQuestion/${questionId}`,
        body: formData,
        method: "PATCH",
      }),
      invalidatesTags: ["Questions"],
    }),
    DeleteQuestion: builder.mutation<ApiGeneralResponse, string>({
      query: (questionId) => ({
        url: `/api/v1/question/deleteQuestion/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    FetchQuestionById: builder.query<getQuestionDetailByIdResponse, string>({
      query: (questionId) => ({
        url: `/api/v1/question/fetchQuestionById/${questionId}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
  }),
});
export const {
  useFetchQuestionsbyCategoryQuery,
  useAddQuestiontoCategoryMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useFetchQuestionByIdQuery,
} = QuestionApi;
