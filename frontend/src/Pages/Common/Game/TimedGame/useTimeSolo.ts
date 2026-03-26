// useTimedSoloGame.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { Socket } from "socket.io-client";
import { createTimedSoloSocket } from "./timedSoloGameSocket";
import {
  GamePhase,
  QuestionPayload,
  RevealPayload,
  GameSocketInstance,
} from "../types/timedSolo.types";

// ─── State ────────────────────────────────────────────────────────────────────

export interface TimedSoloGameState {
  phase: GamePhase;
  question: QuestionPayload | null;
  displayQuestion: QuestionPayload | null;
  remainingMs: number;
  timerPct: number;
  reveal: RevealPayload | null;
  isReconnecting: boolean;
  error: string | null;
}

// ─── Config / Return ──────────────────────────────────────────────────────────

export interface UseTimedSoloGameConfig {
  socket: Socket;
  sessionCode: string;
  initialQuestion: QuestionPayload | null; // from API — shows something on refresh
  onGameEnd: () => void;
}

export interface UseTimedSoloGameReturn {
  state: TimedSoloGameState;
  submitAnswer: (answerIndex: number, questionId: string) => void;
  clearReveal: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTimedSoloGame({
  socket,
  sessionCode,
  initialQuestion,
  onGameEnd,
}: UseTimedSoloGameConfig): UseTimedSoloGameReturn {
  const [state, setState] = useState<TimedSoloGameState>({
    phase: "IDLE",
    question: initialQuestion ?? null, // seed from API on refresh
    displayQuestion: initialQuestion ?? null,
    remainingMs: 0,
    timerPct: 1,
    reveal: null,
    isReconnecting: false,
    error: null,
  });

  const gameSocketRef = useRef<GameSocketInstance | null>(null);
  const onGameEndRef = useRef(onGameEnd);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep onGameEnd ref fresh without re-running the effect
  useEffect(() => {
    onGameEndRef.current = onGameEnd;
  }, [onGameEnd]);

  // Auto-dismiss reveal after 2.5s
  useEffect(() => {
    if (state.phase === "REVEALING" && state.reveal) {
      revealTimerRef.current = setTimeout(clearReveal, 2500);
    }
    return () => {
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [state.phase, state.reveal]);

  // Bootstrap
  useEffect(() => {
    if (!socket || !sessionCode) return;

    const instance = createTimedSoloSocket({
      socket,
      sessionCode,

      onPhaseChange: (phase) => {
        setState((prev) => ({
          ...prev,
          phase,
          isReconnecting: phase === "ACTIVE" ? false : prev.isReconnecting,
          error: phase === "ACTIVE" ? null : prev.error,
        }));
      },

      onTick: (remainingMs, pct) => {
        setState((prev) => ({ ...prev, remainingMs, timerPct: pct }));
      },

      // When reveal fires: store payload, clear timer display
      // DO NOT touch question — it must stay as the answered question
      // so the option highlighting is correct
      onReveal: (payload) => {
        setState((prev) => ({
          ...prev,
          phase: "REVEALING",
          reveal: payload,
          remainingMs: 0,
          timerPct: 0,
          question: payload.nextQuestion ?? prev.question, // preload next
          displayQuestion: prev.question, // keep showing current
          // NO signalReady here
        }));
      },

      onGameEnd: () => {
        setState((prev) => ({ ...prev, phase: "ENDED" }));
        onGameEndRef.current();
      },

      onReconnecting: () => {
        setState((prev) => ({ ...prev, isReconnecting: true }));
      },

      onError: (message) => {
        setState((prev) => ({ ...prev, error: message }));
      },
    });

    gameSocketRef.current = instance;

    // When timer-start arrives: update question + clear reveal
    // This is the ONLY place question changes — not inside onReveal
    // 5. Update syncQuestion — guard against wiping reveal mid-overlay:
    const syncQuestion = (payload: { currentQuestion: QuestionPayload }) => {
      setState((prev) => ({
        ...prev,
        question: payload.currentQuestion,
        displayQuestion:
          prev.phase === "REVEALING"
            ? prev.displayQuestion // don't update display during reveal
            : payload.currentQuestion,
        reveal: prev.phase === "REVEALING" ? prev.reveal : null,
      }));
    };
    socket.on("timer-start", syncQuestion);

    return () => {
      instance.destroy();
      socket.off("timer-start", syncQuestion);
      gameSocketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, sessionCode]);

  const submitAnswer = useCallback(
    (answerIndex: number, questionId: string) => {
      gameSocketRef.current?.submitAnswer(answerIndex, questionId);
    },
    [],
  );

  const clearReveal = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "REVEALING") return prev;
      return {
        ...prev,
        reveal: null,
        displayQuestion: prev.question, // ← swap to preloaded question
      };
    });
    gameSocketRef.current?.signalReady(); // ← only fires here now
  }, []);

  return { state, submitAnswer, clearReveal };
}
