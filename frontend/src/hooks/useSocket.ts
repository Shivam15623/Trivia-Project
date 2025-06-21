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
    
    });
    socketRef.current?.on("disconnect", () => {
     
    });

    return () => {
      // Optional: Leave this alone for persistence
    };
  }, []);

  return socketRef.current!;
};
