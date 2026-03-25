import { LoginData } from "../../interfaces/Authinterfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setLoggedIn, setLoggedOut } from "../AuthSlice/authSlice";

const environment = import.meta.env;

const baseQuery = fetchBaseQuery({
  baseUrl: environment.VITE_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Accept", "application/json");
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ✅ Mutex state — lives outside the function so it's shared across all calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // ✅ If a refresh is already in flight, wait for IT — don't start a new one
    if (!isRefreshing) {
      isRefreshing = true;

      // ✅ async IIFE — avoids .then() on MaybePromise
      refreshPromise = (async (): Promise<boolean> => {
        const refreshResult = await baseQuery(
          { url: "/api/v1/users/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult?.data) {
          const { accessToken, user } = refreshResult.data as LoginData;
          api.dispatch(setLoggedIn({ accessToken, UserData: user }));
          return true;
        } else {
          api.dispatch(setLoggedOut());
          return false;
        }
      })().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }
    // ✅ All concurrent 401s await the same single promise
    const refreshSucceeded = await refreshPromise!;

    if (refreshSucceeded) {
      // ✅ Retry original request now that token is fresh
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Users",
    "Category",
    "Game",
    "GameTemplate",
    "Event",
    "Questions",
    "PromoCode",
    "Plans",
    "GameSession",
    "SoloGame",
  ],
  endpoints: () => ({}),
});

export const {} = api;
