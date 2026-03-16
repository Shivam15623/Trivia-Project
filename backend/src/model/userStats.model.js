import mongoose from "mongoose";

const { Schema } = mongoose;

/* ==============================
   MODE STATS
============================== */

const modeStatsSchema = new Schema(
  {
    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },

    wins: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    highestScore: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

/* ==============================
   PLAYER STATS
============================== */

const playerStatsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* =========================
       OVERALL
    ========================= */

    totalGamesPlayed: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    totalWins: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      index: true, // useful for leaderboards
    },

    highestScoreEver: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    /* =========================
       MODE STATS
    ========================= */

    modes: {
      solo: {
        type: modeStatsSchema,
        default: () => ({
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          highestScore: 0,
        }),
      },

      timed_solo: {
        type: modeStatsSchema,
        default: () => ({
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          highestScore: 0,
        }),
      },

      team: {
        type: modeStatsSchema,
        default: () => ({
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0,
          highestScore: 0,
        }),
      },
    },

    /* =========================
       STREAKS
    ========================= */

    currentWinStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    bestWinStreak: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    currentLoseStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastPlayedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // removes __v
  },
);

/* ==============================
   LEADERBOARD INDEXES
============================== */

// Global leaderboard
playerStatsSchema.index({ totalScore: -1 });

// Best players
playerStatsSchema.index({ totalWins: -1 });

// Streak leaderboard
playerStatsSchema.index({ bestWinStreak: -1 });

export const PlayerStats = mongoose.model("PlayerStats", playerStatsSchema);
