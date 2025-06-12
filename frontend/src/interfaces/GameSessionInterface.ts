import { ApiGeneralResponse, ApiResponse } from "./GenericResponse";

export interface TeamInfo {
  name: string;
  expectedMembers: number;
  currentMembers: number;
  members: Member[];
}
export interface Member {
  userId: string;
  socketId: string;
  username: string;
  score: number;
  hasAnswered: boolean;
  attemptHistory: [
    {
      questionId: string;
      isCorrect: boolean;
    }
  ];
}
export interface GameSessionData {
  sessionId: string;
  host: string;
  sessionCode: string;
  status: "waiting" | "active" | "completed"; // Add more if other statuses exist
  teams: TeamInfo[];
  gameId: string;
}
interface MemberScore {
  userId: string;
  name: string;
  score: number;
}

// Interface for the team scores
interface TeamScore {
  teamName: string;
  teamScore: number;
  members: MemberScore[];
}

export interface JoinGameSessioncredentials {
  sessionCode: string;
  teamName: string;
  socketId: string;
}

export interface submitAnswerSoloCredential {
  sessionId: string;
  questionId: string;
  answer: string;
}
export interface submitAnswerCredential {
  sessionId: string;
  questionId: string;
  answer: string;
  aid: "Deduct" | "None" | "twicePoint";
}
export interface submitAnswerData {
  isCorrect: boolean;
  correctAnswer: string;
  pointsAwarded: number;
  nextTeam: string;
  nextplayer: Member;
  nextcategory: null | string;
  gameEnded: false;
}
export interface currentQuestionData {
  questionId: string;
  points: number;
  QuestionImage: string;
  questionText: string;
  answerImage: string;
  options: string[];
  Answer: string;
  category: {
    id: string;
    name: string;
    thumbnail: string;
  };
}
export interface CategoryfromSession {
  id: string;
  name: string;
  thumbnail: string;
}
export interface startGameData {
  sessionId: string;
  sessionCode: string;
  status: "waiting" | "active" | "completed";
}
export interface GameSession {
  _id: string;
  sessionCode: string;
  host: string;
  status: "waiting" | "active" | "completed";
  teams: Team[];
  gameId: string;
  questionPool: QuestionPoolEntry[];
  usedCategories: string[];
  progress: GameProgress;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface GameSessionTeam {
  name: string;
  score: number;
  members: Player[]; // Assuming members are strings (e.g., team member names)
}
export interface ScoreboardData {
  isDraw: boolean;
  loser: GameSessionTeam | null; // If there's a loser, it will be an object, else null
  winner: GameSessionTeam | null; // If there's a winner, it will be an object, else null
  teams: GameSessionTeam[]; // Array of teams
}
export interface Team {
  name: string;
  expectedMembers: number;
  members: Player[];

  currentMemberIndex: number;
  score: number;
}

export interface Player {
  userId?: string;
  socketId?: string;
  username: string;
  score: number;
  hasAnswered: boolean;
  aids: TeamAids;
  attemptHistory: [
    {
      questionId: string;
      isCorrect: boolean;
    }
  ];
}

export interface TeamAids {
  deductUsed: boolean;
  fiftyFiftyUsed: boolean;
  twicePointUsed: boolean;
}

export interface QuestionPoolEntry {
  category: string;
  points: 200 | 400 | 600;
  teamIndex: 0 | 1;
  questionId: string;
  used: boolean;
}

export interface GameProgress {
  currentCategory?: string;
  currentQuestionId?: string;
  currentPointLevel: 200 | 400 | 600;
  currentStep: 0 | 1;
  currentTeamIndex: number;
}
export interface GameendMessage {
  gameEnded: true;
}
export interface fiftfiftyreq {
  gameSessionId: string;
  teamIndex: number;
  questionId: string;
}
export type fiftyresponse = ApiResponse<string[]>;
export type FullSessionResponse = ApiResponse<GameSession>;
export type EndSessionResponse = ApiResponse<TeamScore[]> | ApiGeneralResponse;
export type SubmitAnswerResponse = ApiResponse<
  submitAnswerData | GameendMessage
>;

export type ScoreBoardResponse = ApiResponse<ScoreboardData>;
export type CurrentQuestionResponse = ApiResponse<currentQuestionData>;
export type sessionInfoResponse = ApiResponse<GameSessionData>;

export type startGameResponse = ApiResponse<startGameData>;
