import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io("http://192.168.1.3:8000", {
      withCredentials: true,
      transports: ["websocket"], // 🚀 Ensures WebSocket connection
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    // Listen for user verification updates
  }
  return socket;
};
export const getSocket = (): Socket => {
  if (!socket) throw new Error("Socket not initialized yet");
  return socket;
};