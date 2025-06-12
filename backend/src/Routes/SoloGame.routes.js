import { Router } from "express";
import {
  CurrentQuestionSolo,
  endSoloGame,
  initializeGame,
  SoloSessionInfo,
  startSologame,
  SubmitAnswerSolo,
} from "../controller/SoloGame.controller.js";
import passport from "passport";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.route("/startgame/:sessionId").patch(startSologame);
router.route("/submitAnswer").patch(SubmitAnswerSolo);
router.route("/fetchCurrentQuestion/:sessionId").get(CurrentQuestionSolo);
router.route("/endGameSolo/:sessionId").patch(endSoloGame);
router.route("/initializeGame").post(initializeGame);
router.route("/FetchSessionInfo/:sessionId").get(SoloSessionInfo);
export default router;
