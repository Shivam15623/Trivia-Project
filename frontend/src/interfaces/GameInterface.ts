import { Category } from "./categoriesInterface";
import { ApiResponse } from "./GenericResponse";

export interface CreateGameByUserPayload {
  title: string;
  categories: string[]; // category IDs
}
export interface Game {
  _id: string;
  title: string;
  templateId: string;
  categories: Category[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface StartSessionPayload {
  mode:"solo" | "team" | "timed_solo"
  teamAName?: string;
  teamBName?: string;
  teamAmembers?: number;
  teamBmembers?: number;
  hostTeam?: "A" | "B";
  categoryIds: string[];
  title:string;
  socketId: string;
}
interface sessionCode {
  sessionCode: string;
}
export type SessionStartResponse = ApiResponse<sessionCode>;
export type userMyGameResponse = ApiResponse<Game[]>;
export type MyGameResponse = ApiResponse<Game>;
