import { Router } from "express";
import requireAdminRole from "../middleware/RouteAuthRole.js";
import passport from "passport";
import { analyticsDashboard } from "../controller/analytics.controller.js";
const router = Router();

router.route("/").get(
  passport.authenticate("jwt", { session: false }),
  requireAdminRole,
  analyticsDashboard,
);

export default router;
