import logError from "@/utills/logError";
import {
  ForgotPasswordcredential,
  LoginCredentials,
  LoginResponse,
  RequestResetPasswordcredential,
  SignupCredentials,
  VerifyEmailCredentials,
} from "../interfaces/Authinterfaces";
import { ApiGeneralResponse } from "../interfaces/GenericResponse";
import { setLoggedIn, setLoggedOut } from "../redux/AuthSlice/authSlice";
import { api } from "../redux/ApiSlice/apiSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    RegisterAdmin: builder.mutation<ApiGeneralResponse, SignupCredentials>({
      query: (credentials) => ({
        url: "/api/v1/auth/register/admin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    RegisterCustomer: builder.mutation<ApiGeneralResponse, SignupCredentials>({
      query: (credentials) => ({
        url: "/api/v1/auth/register/customer",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    LoginUser: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyEmail: builder.mutation<ApiGeneralResponse, VerifyEmailCredentials>({
      query: (credentials) => ({
        url: "/api/v1/auth/verifyEmail",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    resentEmailVerification: builder.mutation<ApiGeneralResponse, string>({
      query: (email) => ({
        url: "/api/v1/auth/verificationRequest",
        method: "POST",
        body: { email },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),
    ResetPasswordRequest: builder.mutation<
      ApiGeneralResponse,
      RequestResetPasswordcredential
    >({
      query: (credentials) => ({
        url: "/api/v1/auth/resetpasswordrequest",
        method: "POST",
        body: credentials,
      }),
    }),
    ForGotPassWord: builder.mutation<
      ApiGeneralResponse,
      ForgotPasswordcredential
    >({
      query: (credentials) => ({
        url: "/api/v1/auth/forgotpassword",
        method: "POST",
        body: credentials,
      }),
    }),
    silentAuth: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/api/v1/auth/silentAuth",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data?.data.accessToken) {
            dispatch(
              setLoggedIn({
                accessToken: data.data.accessToken,
                UserData: data.data.user,
              })
            );
          }
        } catch (error) {
          dispatch(setLoggedOut());
          handleApiError(error);
        }
      },
    }),
  }),
});

export const {
  useForGotPassWordMutation,
  useLoginUserMutation,
  useRegisterAdminMutation,
  useRegisterCustomerMutation,
  useResetPasswordRequestMutation,
  useVerifyEmailMutation,
  useSilentAuthMutation,
  useLogoutMutation,
  useResentEmailVerificationMutation,
} = authApi;
