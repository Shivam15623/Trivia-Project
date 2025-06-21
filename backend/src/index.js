import dotenv from "dotenv";
import http from "http"; // Import http for socket server
import { Server } from "socket.io"; // Import Socket.IO
import ConnectDb from "./db/db.js";
import { app } from "./app.js";
import { handleConnection } from "./controller/Socket.controller.js";

dotenv.config({
  path: "./.env",
});
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    credentials: true,
    origin: ["http://localhost:5173", "http://192.168.1.3:5173"],
  },
});

// Using the controller for handling socket events
io.on("connect", (socket) => {
  handleConnection(socket); // Pass the socket to the controller
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
