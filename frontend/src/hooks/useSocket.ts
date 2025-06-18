// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { initializeSocket } from "@/utills/Socket";
import { Socket } from "socket.io-client";

export const useSocket = (): Socket => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = initializeSocket();
  }

  useEffect(() => {
    // Optional reconnect logging
    socketRef.current?.on("connect", () => {
      console.log("Socket connected");
    });
    socketRef.current?.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      // Optional: Leave this alone for persistence
    };
  }, []);

  return socketRef.current!;
};
