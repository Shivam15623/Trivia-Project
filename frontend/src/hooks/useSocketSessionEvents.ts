import { useEffect, useRef } from "react";
import {
  GameSession,
  currentQuestionData,
} from "@/interfaces/GameSessionInterface";
import { Socket } from "socket.io-client";

export const useSocketSessionEvents = ({
  socket,
  sessionCode,
  setSessionInfo,
  setQuestionData,
  navigate,
  onTimerStart,
  onTimeUp,
}: {
  socket: Socket;
  sessionCode?: string;
  setSessionInfo: (session: GameSession) => void;
  setQuestionData: (question: currentQuestionData) => void;
  navigate: (path: string) => void;
  onTimerStart: (startedAt: string, duration: number) => void;
  onTimeUp: () => void;
}) => {
  const lastQuestionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-session-room", sessionCode);

    // Latency measurement
    socket.on("ping", ({ t1 }: { t1: number }) => {
      socket.emit("pong", { t1 });
    });

    socket.on("game-ended", () => {
      navigate(`/game/endgame/${sessionCode}`);
    });

    socket.on(
      "chngeState",
      ({
        session,
        currentQuestion,
      }: {
        session: GameSession;
        currentQuestion: currentQuestionData;
      }) => {
        setQuestionData(currentQuestion);
        setSessionInfo(session);

        // Only emit player-ready if this is a new question
        const incomingId = currentQuestion.questionId?.toString();
        if (incomingId && incomingId !== lastQuestionIdRef.current) {
          lastQuestionIdRef.current = incomingId;
          socket.emit("player-ready", { sessionCode });
        }
      },
    );

    socket.on(
      "timer-start",
      ({ startedAt, duration }: { startedAt: string; duration: number }) => {
        console.log(startedAt,duration)
        onTimerStart(startedAt, duration);
      },
    );

    socket.on("time-up", () => {
      onTimeUp();
    });

    return () => {
      socket.off("ping");
      socket.off("chngeState");
      socket.off("game-ended");
      socket.off("timer-start");
      socket.off("time-up");
    };
  }, [socket, sessionCode]);
};
