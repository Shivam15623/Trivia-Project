import { LoginData } from "../../interfaces/Authinterfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // ✅ use /react here
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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
 
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/api/v1/users/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken, user } = refreshResult.data as LoginData;
      api.dispatch(setLoggedIn({ accessToken, UserData: user }));
     
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLoggedOut());
    }
  }

  return result;
};

// ✅ Create the API with endpoints directly
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
    "Plans","GameSession","SoloGame"
  ],
  endpoints: () => ({}),
});

// ✅ Export hooks directly from api
export const {} = api;
