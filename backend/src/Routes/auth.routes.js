import { Router } from "express";
import {
  ForgotPassword,
  LoginUser,
  LogOut,
  RegisterAdmin,
  RegisterCustomer,
  silentAuth,
  updateForgotpassword,
  verificationRequest,
  verifyEmail,
} from "../controller/auth.controller.js";
import passport from "passport";
import { validateRequest } from "../middleware/validate.js";
import { registerUserSchema } from "../validations/AuthSchema.js";
const router = Router();
router.route("/register/admin").post(validateRequest(registerUserSchema,"body"), RegisterAdmin);
router.route("/register/customer").post(validateRequest(registerUserSchema,"body"),RegisterCustomer);
router.route("/login").post(LoginUser);
router
  .route("/logout")
  .post(passport.authenticate("jwt", { session: false }), LogOut);
router.route("/verifyEmail").post(verifyEmail);
router.route("/forgotpassword").post(updateForgotpassword);
router.route("/resetpasswordrequest").post(ForgotPassword);
router.route("/silentAuth").post(silentAuth);
router.route("/verificationRequest").post(verificationRequest);
export default router;
