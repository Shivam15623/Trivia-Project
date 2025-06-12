import { Router } from "express";
import {
  GetMyAllGames,
  getUserProfile,
  updatePassword,
  updateProfile,
} from "../controller/user.controller.js";
import passport from "passport";
import { upload } from "../middleware/multer.js";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "../validations/userSchema.js";
import { validateRequest } from "../middleware/validate.js";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.route("/Userprofile").get(getUserProfile);
router.route("/UpdateuserProfile").patch(
  upload.single("profilePic"),
  validateRequest(updateProfileSchema, "body"),
  updateProfile
);
router
  .route("/updatePassword")
  .patch(validateRequest(updatePasswordSchema, "body"), updatePassword);
router.route("/MycreatedGames").get(GetMyAllGames);

export default router;
