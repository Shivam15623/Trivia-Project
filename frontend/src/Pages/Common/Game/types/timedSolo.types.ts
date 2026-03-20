import { Socket } from "socket.io-client";

// ─── Phase machine ────────────────────────────────────────────────────────────
export type GamePhase =
  | "IDLE" // connected, no question yet
  | "ACTIVE" // question live, rAF counting down
  | "SUBMITTING" // user tapped, socket emit in flight
  | "TIME_UP_WAIT" // client timer hit 0, waiting for server time-up
  | "REVEALING" // showing correct answer
  | "ENDED"; // game over

// ─── Payloads matching your server's formatQuestion() ────────────────────────
export interface QuestionCategory {
  id: string;
  name: string;
  thumbnail: string;
}

export interface QuestionPayload {
  questionId: string;
  points: number;
  questionText: string;
  questionImage: string | null;
  answerImage: string | null;
  options: string[];
  Answer: string; // matches your server field name
  category: QuestionCategory;
}

// ─── What the server sends on timer-start ────────────────────────────────────
export interface TimerStartPayload {
  startedAt: string; // ISO string
  expiresAt: string; // ISO string — client uses this for deadline
  timer: number; // duration in seconds (for display only)
  currentQuestion: QuestionPayload;
  session: Record<string, unknown>;
}

// ─── What the server sends on time-up ────────────────────────────────────────
export interface TimeUpPayload {
  correctAnswer: string;
  currentQuestion: QuestionPayload | null; // null = game over
  session: Record<string, unknown>;
  answerImage: string | null; // ← add
}

// ─── What the server sends on answer-result ──────────────────────────────────
export interface AnswerResultPayload {
  isCorrect: boolean;
  correctAnswer: string;
  pointsAwarded: number;
  nextQuestion: QuestionPayload | null; // null = game over
  answerImage: string | null; // ← add
}

// ─── What reveal gives the UI layer ──────────────────────────────────────────
export interface RevealPayload {
  isCorrect: boolean;
  correctAnswer: string;
  pointsAwarded: number;
  nextQuestion: QuestionPayload | null;
  source: "answer" | "timeout"; // so UI can show different messaging
  answerImage: string | null;
}

// ─── Socket ack from server on submit-answer ─────────────────────────────────
export interface SubmitAck {
  status: "ok" | "duplicate" | "late" | "stale" | "error";
  isCorrect?: boolean;
  correctAnswer?: string;
  pointsAwarded?: number;
  inTime?: boolean;
}

// ─── Config passed into createTimedSoloSocket ────────────────────────────────
export interface TimedSoloSocketConfig {
  socket: Socket;
  sessionCode: string;

  // Callbacks — module calls these, never touches DOM
  onPhaseChange: (phase: GamePhase) => void;
  onTick: (remainingMs: number, pct: number) => void; // called every rAF frame
  onReveal: (payload: RevealPayload) => void;
  onGameEnd: () => void;
  onReconnecting: () => void;
  onError: (message: string) => void;
}

// ─── The public handle returned by createTimedSoloSocket ─────────────────────
export interface GameSocketInstance {
  submitAnswer: (answerIndex: number, questionId: string) => void;
  signalReady: () => void;
  destroy: () => void;
}
