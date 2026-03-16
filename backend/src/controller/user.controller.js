import Game from "../model/Game.model.js";
import User from "../model/user.model.js";
import { PlayerStats } from "../model/userStats.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select(
    "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry  -isVerified",
  );
  if (!user) {
    throw new ApiError(500, "No such User Exists");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile Fetched", user));
});
export const updateProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstname, lastname, email, phoneNo, DOB } = req.body;

  if (!firstname || !lastname || !email || !phoneNo || !DOB) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if email or phoneNo already exists in another user
  const existingUser = await User.findOne({
    _id: { $ne: _id },
    $or: [{ email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "Email or phone number is already in use by another account",
    );
  }

  let profilePicUrl;

  // Only upload to Cloudinary if file is provided
  if (req.file && req.file.path) {
    const uploadedPic = await uploadOnCloudinary(req.file.path);
    if (!uploadedPic.url) {
      throw new ApiError(500, "Error while uploading avatar");
    }
    profilePicUrl = uploadedPic.url;
  }

  // Find and update user
  const updateData = {
    firstname,
    lastname,
    email,
    phoneNo,
    DOB,
  };

  if (profilePicUrl) {
    updateData.profilePic = profilePicUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  if (!updatedUser) {
    throw new ApiError(500, "Server error, user not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User profile updated successfully", updatedUser),
    );
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  console;
  const { currentpassword, newpassword, confirmpassword } = req.body;
  if (!currentpassword || !newpassword || !confirmpassword) {
    throw new ApiError(400, "all fields are required");
  }

  const findUser = await User.findById(_id);
  if (!findUser) {
    throw new ApiError(404, "no user with this Id found");
  }
  const isPasswordValid = await findUser.isPasswordCorrect(currentpassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Current Password is not valid");
  }
  if (newpassword !== confirmpassword) {
    throw new ApiError(
      400,
      "both confirmpassword And newpassword does not match",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      password: newpassword,
    },
    { new: true },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Password Updated Successfully"));
});

export const updateProfilepic = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const profilepicPath = req.file.path;
  if (!profilepicPath) {
    throw new ApiError(400, "profile image file is missing");
  }
  const profilepic = await uploadOnCloudinary(profilepicPath);
  if (!profilepic.url) {
    throw new ApiError(500, "Error while uploading on avatar");
  }
  const user = await User.findByIdAndUpdate(
    _id,
    {
      profilePic: profilepic.url,
    },
    { new: true },
  );
  if (!user) {
    throw new ApiError(500, "Error while updating on avatar");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Profile Updated SuccessFully"));
});

export const GetMyAllGames = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const games = await Game.find({ createdBy: userId }).populate(
    "categories",
    "_id name thumbnail",
  );

  // If no games found, return a custom message
  if (games.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "User has not created any games yet"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User's games fetched successfully", games));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const matchStage = {
    role: "customer",
  };

  if (search) {
    matchStage.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: search,
            options: "i",
          },
        },
      },
    ];
  }

  const users = await User.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "playerstats", // Mongo collection name
        localField: "_id",
        foreignField: "user",
        as: "stats",
      },
    },

    {
      $unwind: {
        path: "$stats",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
        profilePic: 1,
        slug: 1,
        accountStatus: 1,
        totalGamesPlayed: {
          $ifNull: ["$stats.totalGamesPlayed", 0],
        },

        overallWinRatio: {
          $cond: [
            { $gt: ["$stats.totalGamesPlayed", 0] },
            {
              $divide: ["$stats.totalWins", "$stats.totalGamesPlayed"],
            },
            0,
          ],
        },
      },
    },

    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalUsers = await User.countDocuments(matchStage);

  return res.status(200).json(
    new ApiResponse(200, "Users fetched successfully", {
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    }),
  );
});
export const fetchUserStatsInfo = asyncHandler(async (req, res) => {
  const { slug: userslug } = req.params;

  const data = await User.aggregate([
    { $match: { slug: userslug } },

    {
      $lookup: {
        from: "playerstats", // collection name in MongoDB
        localField: "_id",
        foreignField: "user",
        as: "stats",
      },
    },

    { $unwind: { path: "$stats", preserveNullAndEmptyArrays: true } },

    {
      $project: {
        _id: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
        profilePic: 1,
        accountStatus: 1,
        lastPlayedAt: "$stats.lastPlayedAt",
        joinDate: "$createdAt",
        totalGamesPlayed: { $ifNull: ["$stats.totalGamesPlayed", 0] },
        totalWins: { $ifNull: ["$stats.totalWins", 0] },
        totalScore: { $ifNull: ["$stats.totalScore", 0] },
        highestScoreEver: { $ifNull: ["$stats.highestScoreEver", 0] },
        overallWinRatio: {
          $cond: [
            { $gt: ["$stats.totalGamesPlayed", 0] },
            { $divide: ["$stats.totalWins", "$stats.totalGamesPlayed"] },
            0,
          ],
        },

        modes: { $ifNull: ["$stats.modes", {}] },
        currentWinStreak: { $ifNull: ["$stats.currentWinStreak", 0] },
        bestWinStreak: { $ifNull: ["$stats.bestWinStreak", 0] },
        currentLoseStreak: { $ifNull: ["$stats.currentLoseStreak", 0] },
      },
    },
  ]);

  if (!data || data.length === 0) throw new ApiError(404, "User not found");

  const userInfo = data[0];
  console.log(userInfo);

  return res
    .status(200)
    .json(new ApiResponse(200, "User stats fetched successfully", userInfo));
});

export const userSuspend = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { days, reason } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const suspendUntil = new Date();
  suspendUntil.setDate(suspendUntil.getDate() + (days || 7));

  user.accountStatus = "suspended";
  user.accountStatusUpdatedAt = new Date();
  user.suspensionExpiry = suspendUntil;
  user.suspensionReason = reason || "Policy violation";

  await user.save({ validateModifiedOnly: true });

  return res
    .status(201)
    .json(new ApiResponse(200, "User Suspended Successfully"));
});
export const userBann = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accountStatus = "banned";
  user.banReason = reason || "Permanent violation";

  await user.save({ validateModifiedOnly: true });

  return res.status(201).json(new ApiResponse(200, "User Banned Successfully"));
});
export const removeUserRestriction = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accountStatus = "active";
  user.accountStatusUpdatedAt = new Date();

  // clear suspension fields
  user.suspensionExpiry = null;
  user.suspensionReason = "";

  // clear ban reason
  user.banReason = "";

  await user.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .json(new ApiResponse(200, "User restriction removed successfully"));
});
