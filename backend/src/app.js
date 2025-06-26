import express from "express";
import cors from "cors";
import passport from "passport";

import cookieParser from "cookie-parser";
import ConPassport from "./middleware/passport.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();
ConPassport(passport);
app.use(passport.initialize());
app.use(cookieParser());
// const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:3000"];
app.use(
  cors({
    credentials: true,
    origin: [process.env.CORS_ORIGIN, "http://192.168.1.17:5173"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import GameRouter from "./Routes/Game.routes.js";

import CategoryRouter from "./Routes/category.routes.js";
import GameSessionRouter from "./Routes/GameSession.routes.js";
import questionRouter from "./Routes/question.routes.js";
import SoloGameRouter from "./Routes/SoloGame.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/game", GameRouter);

app.use("/api/v1/soloGame", SoloGameRouter);
app.use("/api/v1/gamesession", GameSessionRouter);

app.use("/api/v1/question", questionRouter);
app.use("/api/v1/category", CategoryRouter);
app.use(errorHandler);
export { app };
