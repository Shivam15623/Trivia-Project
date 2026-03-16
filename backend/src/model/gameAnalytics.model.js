import mongoose from "mongoose";

const gameAnalyticsSchema = new mongoose.Schema(
  {
    /* ===============================
       RELATION
    =============================== */

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    /* ===============================
       CORE GAME INFO
    =============================== */

    mode: {
      type: String,
      enum: ["solo", "team", "timed_solo"],
      required: true,
      index: true,
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],

    /* ===============================
       PARTICIPATION
    =============================== */

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    playersCount: {
      type: Number,
      required: true,
      min: 1,
    },

    /* ===============================
       PERFORMANCE METRICS
    =============================== */

    totalQuestionsPlayed: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    durationSeconds: {
      type: Number,
    },

    /* ===============================
       TIME DATA (VERY IMPORTANT)
    =============================== */

    startedAt: {
      type: Date,
      required: true,
      index: true,
    },

    completedAt: {
      type: Date,
      required: true,
      index: true,
    },

    dayKey: {
      type: String, // "2026-02-23"
      index: true,
    },

    monthKey: {
      type: String, // "2026-02"
      index: true,
    },
  },
  { timestamps: true },
);

gameAnalyticsSchema.pre("save", function (next) {
  const date = new Date(this.startedAt);

  this.dayKey = date.toISOString().split("T")[0]; // 2026-02-23
  this.monthKey = this.dayKey.slice(0, 7); // 2026-02

  if (this.completedAt && this.startedAt) {
    this.durationSeconds = Math.floor(
      (this.completedAt - this.startedAt) / 1000,
    );
  }

  next();
});

export const GameAnalytics = mongoose.model(
  "GameAnalytics",
  gameAnalyticsSchema,
);
