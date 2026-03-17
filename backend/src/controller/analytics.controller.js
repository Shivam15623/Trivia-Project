import { onlineUsers } from "../index.js";
import Category from "../model/categorie.model.js";
import { GameAnalytics } from "../model/gameAnalytics.model.js";
import { GameSession } from "../model/GameSession.model.js";
import User from "../model/user.model.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";

export const analyticsDashboard = asyncHandler(async (req, res) => {
  const todayKey = new Date().toISOString().split("T")[0];

  const [
    totalGames,
    gamesToday,
    topCategories,
    modeUsage,
    totalCategories,
    activeCategories,
    liveRunningGames,
    avgDurationResult,
    ActiveUsersToday,
    usersByCountry,
  ] = await Promise.all([
    // 1️⃣ Total games played
    GameAnalytics.countDocuments(),

    // 2️⃣ Games played today
    GameAnalytics.countDocuments({ dayKey: todayKey }),

    // 3️⃣ Top 5 categories
    GameAnalytics.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          name: "$category.name",
          thumbnail: "$category.thumbnail",
          count: 1,
        },
      },
    ]),

    // 4️⃣ Mode comparison
    GameAnalytics.aggregate([{ $group: { _id: "$mode", count: { $sum: 1 } } }]),

    // 5️⃣ Total categories
    Category.countDocuments(),

    // 6️⃣ Active (public) categories
    Category.countDocuments({ isPublic: true }),

    // 7️⃣ Live running games — query GameSession, not GameAnalytics
    //    GameAnalytics only has COMPLETED games so it can never tell you what's live.
    //    "active" status means the session is currently in progress.
    GameSession.countDocuments({ status: "active" }),

    // 8️⃣ Average game duration across ALL completed games
    //    durationSeconds is pre-computed by your pre-save hook — no math needed here.
    //    We also include a today-scoped average so you can show both if you want.
    GameAnalytics.aggregate([
      {
        $match: {
          durationSeconds: { $exists: true, $gt: 0 }, // skip corrupt/zero docs
        },
      },
      {
        $facet: {
          // Overall average (all time)
          allTime: [
            { $group: { _id: null, avg: { $avg: "$durationSeconds" } } },
          ],
          // Average for today only
          today: [
            { $match: { dayKey: todayKey } },
            { $group: { _id: null, avg: { $avg: "$durationSeconds" } } },
          ],
        },
      },
    ]),
    GameAnalytics.aggregate([
      {
        $match: {
          dayKey: todayKey,
        },
      },
      { $unwind: "$players" },
      {
        $group: {
          _id: "$players",
        },
      },
      {
        $count: "activeUsers",
      },
    ]),
    // 10️⃣ Users per country (from User model via GameAnalytics players)
    User.aggregate([
      {
        $match: {
          country: { $exists: true, $nin: ["unknown", null, ""] },
        },
      },
      {
        $group: {
          _id: "$country",
          users: { $sum: 1 }, // count users
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          users: 1,
        },
      },
      { $sort: { users: -1 } },
    ]),
  ]);

  // ── Format mode usage ──────────────────────────────────────────────────────
  const formattedModeUsage = { solo: 0, team: 0, timed_solo: 0 };
  modeUsage.forEach((m) => {
    formattedModeUsage[m._id] = m.count;
  });

  // ── Format average duration ────────────────────────────────────────────────
  // avgDurationResult is an array with one element (from $facet)
  const facet = avgDurationResult[0] ?? {};
  const avgDurationAllTime = Math.round(facet.allTime?.[0]?.avg ?? 0); // seconds
  const avgDurationToday = Math.round(facet.today?.[0]?.avg ?? 0); // seconds

  return res.status(200).json(
    new ApiResponse(200, "Analytics data fetched", {
      totalGames,
      gamesToday,
      topCategories,
      modeUsage: formattedModeUsage,
      totalCategories,
      activeCategories,
      liveRunningGames,
      averageGameDuration: {
        allTime: avgDurationAllTime, // e.g. 187  → "3m 7s"
        today: avgDurationToday, // e.g. 210  → "3m 30s"
      },
      liveUsers: onlineUsers.size,
      activeUsersToday: ActiveUsersToday[0]?.activeUsers || 0,
      usersByCountry,
    }),
  );
});
