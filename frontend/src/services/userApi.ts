import {
  passwordChangecredentials,
  UserDetailsResponse,
} from "@/interfaces/Userinterface";
import { api } from "../redux/ApiSlice/apiSlice";
import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import { userMyGameResponse } from "@/interfaces/GameInterface";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: "/api/v1/users/Userprofile",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    UpdateProfile: builder.mutation<ApiGeneralResponse, FormData>({
      query: (formData) => ({
        url: "/api/v1/users/UpdateuserProfile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),
    UpdatePassword: builder.mutation<
      ApiGeneralResponse,
      passwordChangecredentials
    >({
      query: (credentials) => ({
        url: "/api/v1/users/updatePassword",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    FetchMyGames: builder.query<userMyGameResponse, void>({
      query: () => ({
        url: "/api/v1/users/MycreatedGames",
        method: "GET",
      }),
      providesTags: ["Game"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useFetchMyGamesQuery,
} = userApi;
