import { ApiResponse } from "./GenericResponse";
import { User } from "./Userinterface";

export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  user?: User | null;
}
export interface SetLoggedInPayload {
  accessToken: string;
  UserData: User;
}
export interface SignupCredentials {
  firstname: string;
  lastname: string;
  phoneNo: string;
  password: string;
  DOB: Date;
  email: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface VerifyEmailCredentials {
  token: string;
}

export interface ChangeUserDetailsPayLoad {
  UserData: {
    firstname: string;
    lastname: string;
    phoneNo: string;
    profilePic: string;
    DOB: string;
    email: string;
  };
}
export interface ForgotPasswordcredential {
  token: string;
  newpassword: string;
}
export type LoginResponse = ApiResponse<LoginData>;
