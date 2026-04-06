import {
  SoloGameinitresponse,
  SubmitAnswerSoloResponse,
} from "@/interfaces/SoloGameInterface";
import { api } from "../redux/ApiSlice/apiSlice";
import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import { submitAnswerSoloCredential } from "@/interfaces/GameSessionInterface";

export const SoloGameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    InitializeSoloGame: builder.mutation<
      SoloGameinitresponse,
      {
        mode: "solo" | "team" | "timed_solo";
        timer: number;
        categoryIds: string[];
        title: string;
        socketId: string;
      }
    >({
      query: (credentials) => ({
        url: "/api/v1/soloGame/initializeGame",
        method: "POST",
        body: credentials,
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
    }),
    EndSoloGame: builder.mutation<ApiGeneralResponse, string>({
      query: (sessionCode) => ({
        url: `/api/v1/soloGame/endGameSolo/${encodeURIComponent(sessionCode)}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SoloGame"],
    }),
  }),
});

export const {
  useEndSoloGameMutation,
  useInitializeSoloGameMutation,
  useStartSoloGameMutation,
  useSubmitAnswerSoloMutation,
} = SoloGameApi;
