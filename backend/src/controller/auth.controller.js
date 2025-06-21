import { sendResetEmail, sendVerificationEmail } from "../helper/mailer.js";
import User from "../model/user.model.js";
import Game from "../model/Game.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/Asynchandler.js";
import generateTokens from "../utills/GenerateTokens.js";
import jwt from "jsonwebtoken";
export const RegisterAdmin = asyncHandler(async (req, res) => {
  const { firstname, lastname, phoneNo, password, DOB, email } = req.body;
  if (!firstname || !lastname || !phoneNo || !password || !DOB || !email) {
    throw new ApiError(400, "All fields are Required");
  }
  //existing check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "A User Already Exists with This Email");
  }
  const user = await User.create({
    firstname: firstname,
    email: email,
    password: password,
    lastname: lastname,
    DOB: DOB,
    phoneNo: phoneNo,
    isVerified: false,
    role: "admin",
  });
  await sendVerificationEmail({ email: email, userId: user._id });
  if (!user) {
    throw new ApiError(
      500,
      "Its a Server side Error so User Creation UnSuccessfull"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Admin Registered SuccessFully!!"));
});
export const RegisterCustomer = asyncHandler(async (req, res) => {
  const { firstname, lastname, phoneNo, password, DOB, email } = req.body;
  if (!firstname || !lastname || !phoneNo || !password || !DOB || !email) {
    throw new ApiError(400, "All fields are Required");
  }
  //existing check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "A User Already Exists with This Email");
  }
  const user = await User.create({
    firstname: firstname,
    email: email,
    password: password,
    lastname: lastname,
    DOB: DOB,
    phoneNo: phoneNo,
    isVerified: false,
    role: "customer",
  });
  await sendVerificationEmail({ email: email, userId: user._id });
  if (!user) {
    throw new ApiError(
      500,
      "Its a Server side Error so User Creation UnSuccessfull"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User Registered SuccessFully!!"));
});

export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required for login");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "No such user with this email");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Sanitize user object for frontend
  const userToSend = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNo: user.phoneNo,
    DOB: user.DOB,
    role: user.role,
    isVerified: user.isVerified,
    GamesCreated: user.GamesCreated,
    profilePic: user.profilePic,
    slug: user.slug,
  };

  const accessOptions = {
    httpOnly: true,
    secure: true, // must be true for HTTPS (Render uses HTTPS)
    sameSite: "None", // must be 'None' for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const refreshOptions = {
    httpOnly: true,
    secure: true, // must be true for HTTPS (Render uses HTTPS)
    sameSite: "None", // must be 'None' for cross-site cookies
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(
      new ApiResponse(200, "Login successful", {
        user: userToSend,
        accessToken,
        refreshToken,
      })
    );
});
export const LogOut = asyncHandler(async (req, res) => {
  // Clear cookies on the client
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: "",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});
export const ForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is Required ");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(404, "A User With given email Not Found");
  }
  await sendResetEmail({ email: email });
  return res
    .status(200)
    .json(new ApiResponse(200, "Reset password email sent successfully"));
});
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "User Does Not Exist or Token Expired");
  }

  // Update user details
  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;

  await user.save({ validateModifiedOnly: true });
  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully"));
});

export const updateForgotpassword = asyncHandler(async (req, res) => {
  const { token, newpassword } = req.body;

  const user = await User.findOne({
    forgotPasswordToken: token, // Corrected field
    forgotPasswordTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
  });

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid or expired token"));
  }

  user.password = newpassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});
export const silentAuth = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Token mismatch");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  // const finduser = await User.findById(user._id)
  //   .select(
  //     "-password -refreshToken -updatedAt -createdBy -createdAt -isActive -__v"
  //   )
  //   .populate({
  //     path: "roleId",
  //     select: "name permissions panelAccess description -_id",
  //   });
  const LoginResponse = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNo: user.phoneNo,
    DOB: user.DOB,
    role: user.role,
    isVerified: user.isVerified,
    GamesCreated: user.GamesCreated,
    profilePic: user.profilePic,
    slug: user.slug,
  };
  const accessoptions = {
    httpOnly: true,
    secure: true, // must be true for HTTPS (Render uses HTTPS)
    sameSite: "None", // must be 'None' for cross-site cookies
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  const refreshoptions = {
    httpOnly: true,
    secure: true, // must be true for HTTPS (Render uses HTTPS)
    sameSite: "None", // must be 'None' for cross-site cookies
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, accessoptions)
    .cookie("refreshToken", refreshToken, refreshoptions)
    .json(
      new ApiResponse(200, "User Loggin Successfull", {
        user: LoginResponse,
        refreshToken,
        accessToken,
      })
    );
});
export const verificationRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email provide");
  }
  const checkemail = await User.findOne({
    email: email,
  });
  if (!checkemail) {
    throw new ApiError(400, "No Such User exists");
  }
  await sendVerificationEmail({ email: email, userId: checkemail._id });
  return res.status(200).json(new ApiResponse(200, "email verification sent"));
});
