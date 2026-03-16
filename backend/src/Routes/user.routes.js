import { Router } from "express";
import {
  fetchUserStatsInfo,
  getAllUsers,
  GetMyAllGames,
  getUserProfile,
  removeUserRestriction,
  updatePassword,
  updateProfile,
  userBann,
  userSuspend,
} from "../controller/user.controller.js";
import passport from "passport";
import { upload } from "../middleware/multer.js";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "../validations/userSchema.js";
import { validateRequest } from "../middleware/validate.js";
import requireAdminRole from "../middleware/RouteAuthRole.js";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.route("/Userprofile").get(getUserProfile);
router
  .route("/UpdateuserProfile")
  .patch(
    upload.single("profilePic"),
    validateRequest(updateProfileSchema, "body"),
    updateProfile,
  );
router
  .route("/updatePassword")
  .patch(validateRequest(updatePasswordSchema, "body"), updatePassword);
router.route("/MycreatedGames").get(GetMyAllGames);
router.route("/allUsers").get(requireAdminRole, getAllUsers);
router.route("/user-stats/:slug").get(requireAdminRole, fetchUserStatsInfo);
router.route("/suspend/:userId").patch(requireAdminRole, userSuspend);
router.route("/ban/:userId").patch(requireAdminRole, userBann);
router
  .route("/restriction-reset/:userId")
  .patch(requireAdminRole, removeUserRestriction);
export default router;
