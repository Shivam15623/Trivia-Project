import { GameendMessage, GameSession } from "./GameSessionInterface";
import { ApiResponse } from "./GenericResponse";

export interface SoloProgress {
  currentCategory: string | null;
  currentQuestionId: string | null;
  currentPointLevel: 200 | 400 | 600;
}

export interface SoloQuestionEntry {
  category: string;
  points: 200 | 400 | 600;
  questionId: string;
  used: boolean;
}

export interface SoloGameSession {
  _id: string;
  sessionCode: string;
  userId: string;
  username: string;
  score: number;
  attemptHistory: {
    questionId: string;
    isCorrect: boolean;
  }[];
  status: "waiting" | "active" | "completed";
  gameId: string;
  questionPool: SoloQuestionEntry[];
  usedCategories: string[];
  progress: SoloProgress;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface SoloGameinitdata {
  sessionId: string;
  sessionCode: string;
}
export interface submitAnswerDataSolo {
  isCorrect: boolean;
  correctAnswer: string;
  pointsAwarded: number;
  gameEnded: false;
  nextQuestion: {
    questionId: string;
    points: number;
    questionImage: string;
    questionText: string;
    AnswerImage: string;
    options: string[];
    Answer: string;
    category: {
      id: string;
      name: string;
      thumbnail: string;
    };
    // ✅ timer only present for timed_solo, null otherwise
    timer: {
      startedAt: Date;
      duration: Date;
    } | null;
  };
}
export type SubmitAnswerSoloResponse = ApiResponse<
  submitAnswerDataSolo | GameendMessage
>;
export type SoloGameinitresponse = ApiResponse<SoloGameinitdata>;
export type SoloGameResponse = ApiResponse<GameSession>;
