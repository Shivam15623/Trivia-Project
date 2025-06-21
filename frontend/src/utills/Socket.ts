import { io, Socket } from "socket.io-client";

let socket: Socket;
const environment = import.meta.env;
export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(environment.BASE_URL, {
      withCredentials: true,
      transports: ["websocket"], // 🚀 Ensures WebSocket connection
    });

    socket.on("connect", () => {
    
    });

    socket.on("disconnect", () => {
 
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