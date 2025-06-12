import mongoose from "mongoose";
import slugify from "slugify";

import Category from "../model/categorie.model.js";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import { nanoid } from "nanoid";
dotenv.config({ path: "../../.env" });

async function addSlugsToCategories() {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);
    await mongoose.connect(
      "mongodb+srv://Rex123:Shivam123@cluster0.ubg6zxu.mongodb.net/test"
    );

    const users = await User.find({ slug: { $exists: false } });

    console.log(`Found ${users.length} user without slugs.`);

    for (const user of users) {
      const fullName = `${user.firstname} ${user.lastname}`;
      const baseSlug = slugify(fullName, { lower: true, strict: true });
      const uniqueId = nanoid(6); // change length if needed

      user.slug = `${baseSlug}-${uniqueId}`;
      await user.save({ validateBeforeSave: false });
      console.log(`Updated: ${user.firstname} -> ${user.slug}`);
    }

    console.log("✅ Slug update complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating slugs:", err);
    process.exit(1);
  }
}

addSlugsToCategories();
