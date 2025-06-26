import { ApiResponse } from "./GenericResponse";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNo: string;
  DOB: string; // ISO date string
  profilePic: string;
  role: "admin" | "customer"; // add more roles as needed
  slug: string;
  isVerified: boolean;
  gameCredits: number;
  GamesCreated: string[]; // this could be just string[] if only IDs are populated
}
export interface UserProfileUpdateCredentials {
  firstname: string;
  lastname: string;
  email: string;
  phoneNo: string;
  DOB: string;
  profilePic: File;
}
export interface UserProfileInfo {
  _id: string;
  firstname: string;
  lastname: string;
  profilePic: string;
  email: string;
  DOB: string; // ISO Date string
  phoneNo: string;
  GamesCreated: string[]; // Array of ObjectIds
  gameCredits: number;
  role: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
export interface passwordChangecredentials {
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
}
export type ProfileupdateResponse = ApiResponse<UserProfileInfo>;
export type UserDetailsResponse = ApiResponse<UserProfileInfo>;
