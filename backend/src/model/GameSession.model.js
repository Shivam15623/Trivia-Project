import mongoose from "mongoose";

// 🟨 Aids Subschema
const aidsSchema = new mongoose.Schema(
  {
    deductUsed: { type: Boolean, default: false },
    fiftyFiftyUsed: { type: Boolean, default: false },
    twicePointUsed: { type: Boolean, default: false },
  },
  { _id: false }
);

// 🟩 Player Subschema
const playerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    socketId: { type: String },
    username: { type: String, required: true },
    score: { type: Number, default: 0, min: 0 },
    hasAnswered: { type: Boolean, default: false },
    aids: { type: aidsSchema, default: () => ({}) },
    attemptHistory: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        isCorrect: { type: Boolean, required: true },
      },
    ],
  },
  { _id: false }
);

// 🟦 Team Subschema
const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    expectedMembers: { type: Number, required: true, min: 1 },
    members: {
      type: [playerSchema],
      validate: {
        validator: function (members) {
          const usernames = members.map((m) => m.username);
          return new Set(usernames).size === usernames.length;
        },
        message: "Each member must have a unique username within the team.",
      },
    },

    currentMemberIndex: { type: Number, default: 0 },
    score: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

// 🟥 Question Pool Item
const questionEntrySchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    points: { type: Number, enum: [200, 400, 600] },
    teamIndex: { type: Number, enum: [0, 1] }, // 0 = A, 1 = B
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    used: { type: Boolean, default: false },
  },
  { _id: false }
);

// 🧠 Game Progress Subschema
const progressSchema = new mongoose.Schema(
  {
    currentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    currentQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    currentPointLevel: { type: Number, enum: [200, 400, 600], default: 200 },
    currentStep: { type: Number, enum: [0, 1], default: 0 }, // A then B per point
    currentTeamIndex: { type: Number, default: 0 },
  },
  { _id: false }
);

// 🟥 Main GameSession Schema
const gameSessionSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, unique: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting",
    },

    teams: {
      type: [teamSchema],
      required: true,
      validate: {
        validator: function (teams) {
          const names = teams.map((t) => t.name.toLowerCase());
          return new Set(names).size === names.length;
        },
        message: "Each team must have a unique name.",
      },
    },

    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },

    // 🔁 Game Flow Tracking
    questionPool: { type: [questionEntrySchema], default: [] },
    usedCategories: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    progress: { type: progressSchema, default: () => ({}) },

    startedAt: { type: Date },
    completedAt: { type: Date },
    expiresAt: { type: Date, index: { expires: 0 } },
  },
  { timestamps: true }
);
gameSessionSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  next();
});
export const GameSession = mongoose.model("GameSession", gameSessionSchema);
