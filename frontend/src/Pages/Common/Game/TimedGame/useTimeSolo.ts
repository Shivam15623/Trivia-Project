import { useEffect, useRef, useCallback, useState } from "react";
import { Socket } from "socket.io-client";
import { createTimedSoloSocket } from "./timedSoloGameSocket";
import {
  GamePhase,
  QuestionPayload,
  RevealPayload,
  GameSocketInstance,
} from "../types/timedSolo.types";

export interface TimedSoloGameState {
  phase: GamePhase;
  question: QuestionPayload | null;
  displayQuestion: QuestionPayload | null;
  remainingMs: number;
  timerPct: number;
  reveal: RevealPayload | null;
  isReconnecting: boolean;
  isWaitingForServer: boolean; // ← add
  error: string | null;
}

export interface UseTimedSoloGameConfig {
  socket: Socket;
  sessionCode: string;
  initialQuestion: QuestionPayload | null;
  onGameEnd: () => void;
}

export interface UseTimedSoloGameReturn {
  state: TimedSoloGameState;
  submitAnswer: (answerIndex: number, questionId: string) => void;
  clearReveal: () => void;
}

export function useTimedSoloGame({
  socket,
  sessionCode,
  initialQuestion,
  onGameEnd,
}: UseTimedSoloGameConfig): UseTimedSoloGameReturn {
  const [state, setState] = useState<TimedSoloGameState>({
    phase: "IDLE",
    question: initialQuestion ?? null,
    displayQuestion: initialQuestion ?? null,
    remainingMs: 0,
    timerPct: 1,
    reveal: null,
    isReconnecting: false,
    isWaitingForServer: false,
    error: null,
  });

  const gameSocketRef = useRef<GameSocketInstance | null>(null);
  const onGameEndRef = useRef(onGameEnd);
  // const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onGameEndRef.current = onGameEnd;
  }, [onGameEnd]);

  // Bootstrap
  useEffect(() => {
    if (!socket || !sessionCode) return;

    console.log(`[Hook] bootstrapping  session=${sessionCode}`);

    const instance = createTimedSoloSocket({
      socket,
      sessionCode,

      onPhaseChange: (phase) => {
        setState((prev) => ({
          ...prev,
          phase,
          isWaitingForServer: false, // ← add
          isReconnecting: phase === "ACTIVE" ? false : prev.isReconnecting,
          error: phase === "ACTIVE" ? null : prev.error,
        }));
      },

      onTick: (remainingMs, pct, waiting = false) => {
        setState((prev) => ({
          ...prev,
          remainingMs,
          timerPct: pct,
          isWaitingForServer: waiting, // ← add
        }));
      },

      onReveal: (payload) => {
        console.log(
          `[Hook] onReveal fired  source=${payload.source}  isCorrect=${payload.isCorrect}`,
        );
        console.log(
          `[Hook] onReveal  nextQuestion=${payload.nextQuestion?.questionId ?? "null (game ending)"}`,
        );
        console.log(
          `[Hook] onReveal  preloading next Q behind overlay, displayQuestion stays on current`,
        );
        setState((prev) => {
          console.log(
            `[Hook] onReveal setState  prev.question=${prev.question?.questionId}  prev.displayQuestion=${prev.displayQuestion?.questionId}`,
          );
          return {
            ...prev,
            phase: "REVEALING",
            reveal: payload,
            remainingMs: 0,
            timerPct: 0,
            question: payload.nextQuestion ?? prev.question,
            displayQuestion: prev.question, // keep showing current during overlay
          };
        });
      },

      onGameEnd: () => {
        console.log(`[Hook] onGameEnd fired — navigating away`);
        setState((prev) => ({ ...prev, phase: "ENDED" }));
        onGameEndRef.current();
      },

      onReconnecting: () => {
        console.log(`[Hook] onReconnecting fired`);
        setState((prev) => ({ ...prev, isReconnecting: true }));
      },

      onError: (message) => {
        console.warn(`[Hook] onError  message="${message}"`);
        setState((prev) => ({ ...prev, error: message }));
      },
    });

    gameSocketRef.current = instance;

    const syncQuestion = (payload: { currentQuestion: QuestionPayload }) => {
      console.log(
        `[Hook] syncQuestion (timer-start)  incomingQ=${payload.currentQuestion.questionId}`,
      );
      setState((prev) => {
        const duringReveal = prev.phase === "REVEALING";
        console.log(
          `[Hook] syncQuestion  phase=${prev.phase}  duringReveal=${duringReveal}`,
        );
        console.log(
          `[Hook] syncQuestion  prev.question=${prev.question?.questionId}  prev.displayQuestion=${prev.displayQuestion?.questionId}`,
        );
        if (duringReveal) {
          console.log(
            `[Hook] syncQuestion  REVEALING — updating question buffer only, displayQuestion unchanged`,
          );
        } else {
          console.log(
            `[Hook] syncQuestion  NOT revealing — updating both question and displayQuestion`,
          );
        }
        return {
          ...prev,
          question: payload.currentQuestion,
          displayQuestion: duringReveal
            ? prev.displayQuestion
            : payload.currentQuestion,
          reveal: duringReveal ? prev.reveal : null,
        };
      });
    };
    socket.on("timer-start", syncQuestion);

    return () => {
      console.log(`[Hook] cleanup — destroying socket instance`);
      instance.destroy();
      socket.off("timer-start", syncQuestion);
      gameSocketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, sessionCode]);

  const submitAnswer = useCallback(
    (answerIndex: number, questionId: string) => {
      console.log(
        `[Hook] submitAnswer  answerIndex=${answerIndex}  questionId=${questionId}`,
      );
      gameSocketRef.current?.submitAnswer(answerIndex, questionId);
    },
    [],
  );

  const clearReveal = useCallback(() => {
    console.log(`[Hook] clearReveal called — overlay exiting`);
    setState((prev) => {
      if (prev.phase !== "REVEALING") {
        console.warn(
          `[Hook] clearReveal  phase=${prev.phase} — not REVEALING, skipping`,
        );
        return prev;
      }
      console.log(
        `[Hook] clearReveal  swapping displayQuestion: ${prev.displayQuestion?.questionId} → ${prev.question?.questionId}`,
      );
      return {
        ...prev,
        reveal: null,
        displayQuestion: prev.question, // swap to preloaded question instantly
      };
    });
    console.log(`[Hook] clearReveal  emitting signalReady → player-ready`);
    gameSocketRef.current?.signalReady();
  }, []);

  return { state, submitAnswer, clearReveal };
}
