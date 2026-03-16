import dotenv from "dotenv";
import http from "http"; // Import http for socket server
import { Server } from "socket.io"; // Import Socket.IO
import ConnectDb from "./db/db.js";
import { app } from "./app.js";
import { handleConnection } from "./controller/Socket.controller.js";
import jwt from "jsonwebtoken";
dotenv.config({
  path: "./.env",
});
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  },
});
export const onlineUsers = new Map();
// Using the controller for handling socket events
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  socket.user = decoded;

  next();
});
io.on("connect", (socket) => {
  const userId = socket.user._id;

  const count = onlineUsers.get(userId) || 0;
  onlineUsers.set(userId, count + 1);

  io.emit("live-users-update", onlineUsers.size);

  socket.on("disconnect", () => {
    const remaining = onlineUsers.get(userId) - 1;

    if (remaining <= 0) {
      onlineUsers.delete(userId);
    } else {
      onlineUsers.set(userId, remaining);
    }

    io.emit("live-users-update", onlineUsers.size);
  });
  handleConnection(socket);

  // Pass the socket to the controller
});
ConnectDb()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
