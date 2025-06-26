import { useEffect } from "react";
import { GameSession, currentQuestionData } from "@/interfaces/GameSessionInterface";
import { Socket } from "socket.io-client";

export const useSocketSessionEvents = ({
  socket,
  sessionCode,
  setSessionInfo,
  setQuestionData,
  navigate,
}: {
  socket: Socket;
  sessionCode?: string;
  setSessionInfo: (session: GameSession) => void;
  setQuestionData: (question: currentQuestionData) => void;
  navigate: (path: string) => void;
}) => {
  useEffect(() => {
    console.log("hel",socket)
    if (!socket) return;

    const handleChangeState = ({
      session,
      currentQuestion,
    }: {
      session: GameSession;
      currentQuestion: currentQuestionData;
    }) => {
      setQuestionData(currentQuestion);
      setSessionInfo(session);
      console.log("🔄 Real-time update received", session, currentQuestion);
    };

    socket.emit("join-session-room", sessionCode);
    socket.on("game-ended", () => {
      navigate(`/game/endgame/${sessionCode}`);
    });
    socket.on("chngeState", handleChangeState);

    return () => {
      socket.off("chngeState");
      socket.off("game-ended");
    };
  }, [socket, sessionCode, setSessionInfo, setQuestionData, navigate]);
};
