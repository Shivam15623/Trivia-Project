import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../model/user.model.js";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const generateEmailTemplate = ({ title, message, buttonText, link }) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 450px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f4f4f4;">
        <h2 style="text-align: center; color: #333;">${title}</h2>
        <p style="font-size: 16px; color: #555;">${message}</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${buttonText}
          </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">If you didn’t request this, ignore this email.</p>
      </div>`;
};
export const sendVerificationEmail = async ({ email, userId }) => {
  try {
    if (!userId) throw new Error("User ID is required for verification email.");

    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    await User.findByIdAndUpdate(
      userId,
      {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      },
      { new: true }
    );

    const emailContent = generateEmailTemplate({
      title: "Verify Your Email",
      message:
        "Click the button below to verify your email and activate your account.",
      buttonText: "Verify Email",
      link: `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`,
    });

    return await transporter.sendMail({
      from: "phenomenalshivam2@gmail.com",
      to: email,
      subject: "Verify your email",
      html: emailContent,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
// ✅ Send Password Reset Email
export const sendResetEmail = async ({ email }) => {
  try {
    const hashedToken = await bcrypt.hash(email, 10);
    await User.updateOne(
      { email },
      {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      }
    );

    const emailContent = generateEmailTemplate({
      title: "Reset Your Password",
      message:
        "Click the button below to reset your password. This link is valid for 1 hour.",
      buttonText: "Reset Password",
      link: `${process.env.DOMAIN}/reset-password?token=${hashedToken}`,
    });

    return await transporter.sendMail({
      from: "phenomenalshivam2@gmail.com",
      to: email,
      subject: "Reset your password",
      html: emailContent,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
