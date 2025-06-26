import {
  SoloGameinitresponse,
  SoloGameResponse,
  SubmitAnswerSoloResponse,
} from "@/interfaces/SoloGameInterface";
import { api } from "../redux/ApiSlice/apiSlice";
import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import {
  CurrentQuestionResponse,
  submitAnswerSoloCredential,
} from "@/interfaces/GameSessionInterface";

export const SoloGameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    InitializeSoloGame: builder.mutation<
      SoloGameinitresponse,
      { gameId: string }
    >({
      query: ({ gameId }) => ({
        url: "/api/v1/soloGame/initializeGame",
        method: "POST",
        body: { gameId },
      }),
      invalidatesTags: ["SoloGame"],
    }),
    StartSoloGame: builder.mutation<ApiGeneralResponse, string>({
      query: (sessionId) => ({
        url: `/api/v1/soloGame/startgame/${encodeURIComponent(sessionId)}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SoloGame"],
    }),
    SubmitAnswerSolo: builder.mutation<
      SubmitAnswerSoloResponse,
      submitAnswerSoloCredential
    >({
      query: (credentials) => ({
        url: "/api/v1/soloGame/submitAnswer",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result) => {
        if (result?.success && result.data?.gameEnded) {
          return [{ type: "SoloGame" }];
        }
        return [];
      },
    }),
    EndSoloGame: builder.mutation<ApiGeneralResponse, string>({
      query: (sessionId) => ({
        url: `/api/v1/soloGame/endGameSolo/${encodeURIComponent(sessionId)}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SoloGame"],
    }),
    CurrentQuestionSolo: builder.query<CurrentQuestionResponse, string>({
      query: (sessionId) => ({
        url: `/api/v1/soloGame/fetchCurrentQuestion/${encodeURIComponent(
          sessionId
        )}`,
        method: "GET",
      }),
      providesTags: ["SoloGame"],
    }),
    FetchSessionInfoSolo: builder.query<SoloGameResponse, string>({
      query: (sessionId) => ({
        url: `/api/v1/soloGame/FetchSessionInfo/${encodeURIComponent(
          sessionId
        )}`,
        method: "GET",
      }),
      providesTags: ["SoloGame"],
    }),
  }),
});

export const {
  useCurrentQuestionSoloQuery,
  useEndSoloGameMutation,
  useFetchSessionInfoSoloQuery,
  useInitializeSoloGameMutation,
  useStartSoloGameMutation,
  useSubmitAnswerSoloMutation,
} = SoloGameApi;
