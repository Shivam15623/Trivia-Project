import {
  AllUserResponse,
  passwordChangecredentials,
  ProfileupdateResponse,
  UserDetailsResponse,
} from "@/interfaces/Userinterface";
import { api } from "../redux/ApiSlice/apiSlice";
import { ApiGeneralResponse, ApiResponse } from "@/interfaces/GenericResponse";
import { userMyGameResponse } from "@/interfaces/GameInterface";
export interface UserStatsData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  profilePic: string;
  totalGamesPlayed: number;
  accountStatus: "active" | "suspended" | "banned" | "deleted";
  totalWins: number;
  totalScore: number;
  highestScoreEver: number;
  lastPlayedAt: Date;
  joinDate: Date;
  overallWinRatio: number; // value between 0 and 1
  modes: {
    solo?: {
      gamesPlayed: number;
      wins: number;
      totalScore: number;
      highestScore: number;
    };
    timed_solo?: {
      gamesPlayed: number;
      wins: number;
      totalScore: number;
      highestScore: number;
    };
    team?: {
      gamesPlayed: number;
      wins: number;
      totalScore: number;
      highestScore: number;
    };
  };
  currentWinStreak: number;
  bestWinStreak: number;
  currentLoseStreak: number;
}
export type UserStatsResponse = ApiResponse<UserStatsData>;
export interface SuspendUserRequest {
  userId: string;
  days?: number;
  reason?: string;
}

export interface BanUserRequest {
  userId: string;
  reason?: string;
}
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: "/api/v1/users/Userprofile",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    UpdateProfile: builder.mutation<ProfileupdateResponse, FormData>({
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
    AllUsers: builder.query<
      AllUserResponse,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/api/v1/users/allUsers",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Users"],
    }),
    userStats: builder.query<UserStatsResponse, { slug: string }>({
      query: ({ slug }) => ({
        url: `/api/v1/users/user-stats/${slug}`,
        method: "GET",
      }),
    }),
    suspendUser: builder.mutation<ApiGeneralResponse, SuspendUserRequest>({
      query: ({ userId, days, reason }) => ({
        url: `/api/v1/users/suspend/${userId}`,
        method: "PATCH",
        body: { days, reason },
      }),
      invalidatesTags: ["Users"],
    }),

    banUser: builder.mutation<ApiGeneralResponse, BanUserRequest>({
      query: ({ userId, reason }) => ({
        url: `/api/v1/users/ban/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useFetchMyGamesQuery,
  useAllUsersQuery,
  useLazyUserStatsQuery,
  useBanUserMutation,
  useSuspendUserMutation,
} = userApi;
