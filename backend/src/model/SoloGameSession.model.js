import mongoose from "mongoose";

// 🧠 Solo Game Progress Schema
const soloProgressSchema = new mongoose.Schema(
  {
    currentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    currentQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    currentPointLevel: { type: Number, enum: [200, 400, 600], default: 200 },
  },
  { _id: false }
);
const SoloquestionEntrySchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    points: { type: Number, enum: [200, 400, 600] },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    used: { type: Boolean, default: false },
  },
  { _id: false }
);

// 🟩 Main Solo Game Session Schema
const soloGameSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true },
    score: { type: Number, default: 0, min: 0 },
    attemptHistory: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        isCorrect: { type: Boolean, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting",
    },

    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },

    // 🔁 Game Flow Tracking for Solo
    questionPool: { type: [SoloquestionEntrySchema], default: [] },
    usedCategories: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    progress: { type: soloProgressSchema, default: () => ({}) },

    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const SoloGameSession = mongoose.model(
  "SoloGameSession",
  soloGameSessionSchema
);
