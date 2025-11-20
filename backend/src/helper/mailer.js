import bcrypt from "bcrypt";
import SibApiV3Sdk from "sib-api-v3-sdk";
import User from "../model/user.model.js";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // your Brevo API key

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const senderEmail = "phenomenalshivam2@gmail.com";
const senderName = "CRM";

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

// ✅ Send Verification Email
export const sendVerificationEmail = async ({ email, userId }) => {
  if (!userId) throw new Error("User ID is required for verification email.");

  const hashedToken = await bcrypt.hash(userId.toString(), 10);
  await User.findByIdAndUpdate(
    userId,
    {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000, // 1 hour
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

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject: "Verify your email",
      htmlContent: emailContent,
    });

    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email via Brevo");
  }
};

// ✅ Send Password Reset Email
export const sendResetEmail = async ({ email }) => {
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

  try {
    const response = await apiInstance.sendTransacEmail({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject: "Reset your password",
      htmlContent: emailContent,
    });

    return response;
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email via Brevo");
  }
};
