import mongoose from "mongoose";
import slugify from "slugify";

import Category from "../model/categorie.model.js";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import { nanoid } from "nanoid";
dotenv.config({ path: "../../.env" });

async function addSlugsToCategories() {
  try {
  
    await mongoose.connect(
      "mongodb+srv://Rex123:Shivam123@cluster0.ubg6zxu.mongodb.net/test"
    );

    const users = await User.find({ slug: { $exists: false } });

  

    for (const user of users) {
      const fullName = `${user.firstname} ${user.lastname}`;
      const baseSlug = slugify(fullName, { lower: true, strict: true });
      const uniqueId = nanoid(6); // change length if needed

      user.slug = `${baseSlug}-${uniqueId}`;
      await user.save({ validateBeforeSave: false });
  
    }

 
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating slugs:", err);
    process.exit(1);
  }
}

addSlugsToCategories();
