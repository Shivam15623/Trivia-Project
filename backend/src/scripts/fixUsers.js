import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../model/user.model.js";

dotenv.config({
  path: "./.env",
});
async function fixUsers() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );

    const result = await User.updateMany(
      { accountStatus: { $exists: false } },
      {
        $set: {
          accountStatus: "active",
          suspensionReason: "",
          accountStatusUpdatedAt: new Date(),
        },
      },
    );

    console.log("Users updated:", result.modifiedCount);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixUsers();
