import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import { nanoid } from "nanoid";
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z]+$/, "First name must contain only letters"],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z]+$/, "Last name must contain only letters"],
    },
    profilePic: {
      type: String, // This can be a URL or file path
      default: "", // Optional
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    DOB: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          const now = new Date();
          const minAgeDate = new Date();
          minAgeDate.setFullYear(now.getFullYear() - 4);

          return value <= minAgeDate;
        },
        message:
          "User must be at least 4 years old and DOB cannot be in the future",
      },
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\+?[1-9]\d{7,14}$/,
        "Please enter a valid international phone number",
      ],
    },
    MyGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game", // Changed from "Games"
      },
    ],

    gameCredits: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from name
UserSchema.pre("validate", function (next) {
  if (
    this.isModified("firstname") ||
    this.isModified("lastname") ||
    !this.slug
  ) {
    const fullName = `${this.firstname} ${this.lastname}`;
    const baseSlug = slugify(fullName, { lower: true, strict: true });
    const uniqueId = nanoid(6); // change length if needed
    this.slug = `${baseSlug}-${uniqueId}`;
  }
  next();
});
// 🔒 Pre-save: Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔐 Access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "7d",
    }
  );
};

// 🔁 Refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
    }
  );
};

const User = mongoose.model("User", UserSchema);
export default User;
