import { Router } from "express";
import {
  endSoloGame,
  initializeGame,
  startSologame,
  SubmitAnswerSolo,
} from "../controller/SoloGame.controller.js";
import passport from "passport";
import { gameRestriction } from "../middleware/gameRestriction.js";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.route("/startgame/:sessionId").patch(gameRestriction, startSologame);
router.route("/submitAnswer").patch(gameRestriction, SubmitAnswerSolo);
// router.route("/fetchCurrentQuestion/:sessionId").get(CurrentQuestionSolo);
router.route("/endGameSolo/:sessionCode").patch(gameRestriction, endSoloGame);
router.route("/initializeGame").post(gameRestriction, initializeGame);
// router.route("/FetchSessionInfo/:sessionId").get(SoloSessionInfo);
export default router;
