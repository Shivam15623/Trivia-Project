import { useEffect, useRef } from "react";
import { initializeSocket } from "@/utills/Socket";
import { Socket } from "socket.io-client";


export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();
    }

    return () => {
      // Don’t disconnect if you want persistence across routes
      // socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};