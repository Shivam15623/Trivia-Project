import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import { api } from "../redux/ApiSlice/apiSlice";
import {
  CreateGameByUserPayload,
  MyGameResponse,
} from "@/interfaces/GameInterface";

export const GameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    CreateGameByUser: builder.mutation<
      ApiGeneralResponse,
      CreateGameByUserPayload
    >({
      query: (credentials) => ({
        url: "/api/v1/game/createGamebyUser",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Game"],
    }),
    GetGameById: builder.query<MyGameResponse, string>({
      query: (gameId) => ({
        url: `/api/v1/game/fetchGame/${encodeURIComponent(gameId)}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useCreateGameByUserMutation, useGetGameByIdQuery } = GameApi;
