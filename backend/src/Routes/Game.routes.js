import { Router } from "express";
import {
  createGamebyUser,
  getGameById,
} from "../controller/Game.controller.js";
import passport from "passport";
import { validateRequest } from "../middleware/validate.js";
import { createGameSchema } from "../validations/GameSchema.js";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));

// POST route to create a game by user
router
  .route("/createGamebyUser")
  .post(validateRequest(createGameSchema), createGamebyUser);
// GET route to fetch a game by its ID
router.route("/fetchGame/:gameId").get(getGameById);

export default router;
