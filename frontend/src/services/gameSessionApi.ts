import {
  SessionStartResponse,
  StartSessionPayload,
} from "@/interfaces/GameInterface";
import { api } from "../redux/ApiSlice/apiSlice";
import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import {
  CurrentQuestionResponse,
  EndSessionResponse,
  fiftfiftyreq,
  fiftyresponse,
  FullSessionResponse,
  JoinGameSessioncredentials,
  ScoreBoardResponse,
  sessionInfoResponse,
  startGameResponse,
  submitAnswerCredential,
  SubmitAnswerResponse,
} from "@/interfaces/GameSessionInterface";

export const GameSessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    StartSession: builder.mutation<SessionStartResponse, StartSessionPayload>({
      query: (credentials) => ({
        url: "/api/v1/gamesession/startsession",
        method: "POST",
        body: credentials,
      }),
    }),
    FetchGameSessionInfo: builder.query<FullSessionResponse, string>({
      query: (sessionCode) => ({
        url: `/api/v1/gamesession/session/${sessionCode}`,
        method: "GET",
      }),
    }),
    JoinGameSession: builder.mutation<
      ApiGeneralResponse,
      JoinGameSessioncredentials
    >({
      query: (credentials) => ({
        url: "api/v1/gamesession/JoinSession",
        method: "PATCH",
        body: credentials,
      }),
    }),
    GameSessionEnd: builder.mutation<EndSessionResponse, string>({
      query: (sessionId) => ({
        url: "api/v1/gamesession/EndSession",
        method: "PATCH",
        body: { sessionId },
      }),
    }),
    StartGame: builder.mutation<startGameResponse, string>({
      query: (sessionId) => ({
        url: "api/v1/gamesession/startMatch",
        method: "PATCH",
        body: { sessionId },
      }),
    }),
    FetchWaitingroominfo: builder.query<sessionInfoResponse, string>({
      query: (sessionCode) => ({
        url: `/api/v1/gamesession/Waitingroom/${sessionCode}`,
        method: "GET",
      }),
    }),
    FetchCurrentQuestion: builder.query<CurrentQuestionResponse, string>({
      query: (sessionCode) => ({
        url: `/api/v1/gamesession/currentQuestion/${sessionCode}`,
        method: "GET",
      }),
    }),
    SubmitAnswer: builder.mutation<
      SubmitAnswerResponse,
      submitAnswerCredential
    >({
      query: (credentials) => ({
        url: "/api/v1/gamesession/submitAnswer",
        method: "PATCH",
        body: credentials,
      }),
    }),
    FetchScoreBoard: builder.query<ScoreBoardResponse, string>({
      query: (sessionCode) => ({
        url: `/api/v1/gamesession/FetchScoreBoard/${sessionCode}`,
        method: "GET",
      }),
    }),
    FiftyFiftyUse: builder.mutation<fiftyresponse, fiftfiftyreq>({
      query: (credentials) => ({
        url: "/api/v1/gamesession/FiftyFiftyUse",
        method: "PATCH",
        body: credentials,
      }),
    }),
  }),
});
export const {
  useStartSessionMutation,
  useFetchGameSessionInfoQuery,
  useJoinGameSessionMutation,
  useGameSessionEndMutation,
  useStartGameMutation,
  useFetchWaitingroominfoQuery,
  useFetchCurrentQuestionQuery,
  useSubmitAnswerMutation,
  useFetchScoreBoardQuery,
  useFiftyFiftyUseMutation,
} = GameSessionApi;
