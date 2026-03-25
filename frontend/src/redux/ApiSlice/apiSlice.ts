import { LoginData } from "../../interfaces/Authinterfaces";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setLoggedIn, setLoggedOut } from "../AuthSlice/authSlice";

const environment = import.meta.env;

type BaseQueryResult = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

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

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result: BaseQueryResult = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = (async (): Promise<string | null> => {
        const refreshResult: BaseQueryResult = await baseQuery(
          { url: "/api/v1/users/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult?.data) {
          const { accessToken, user } = refreshResult.data as LoginData;
          api.dispatch(setLoggedIn({ accessToken, UserData: user }));
          return accessToken;
        } else {
          api.dispatch(setLoggedOut());
          return null;
        }
      })().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise!;

    if (newToken) {
      const originalArgs = typeof args === "string" ? { url: args } : args;
      result = await baseQuery(
        {
          ...originalArgs,
          headers: {
            ...(originalArgs.headers ?? {}),
            Accept: "application/json",
            authorization: `Bearer ${newToken}`,
          },
        },
        api,
        extraOptions,
      );
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

export default api;
