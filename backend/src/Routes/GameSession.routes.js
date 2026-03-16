import { Router } from "express";
import {
  currentQuestion,
  EndSession,
  // FiftyFiftyAid,
  getSessionInfo,

  joinSession,
  ScoreBoard,
  startPlayMatch,
  StartSession,
  SubmitAnswer,
} from "../controller/GameSession.controller.js";
import passport from "passport";
import { validateRequest } from "../middleware/validate.js";
import {
  // FiftyFiftyAidSchema,
  JoinGameSessionSchema,
  StartGameSessionSchema,
  SubmitAnswerSchema,
} from "../validations/GameSessionSchema.js";
import { gameRestriction } from "../middleware/GameRestriction.js";
const router = Router();
// ✅ apply to all routes
router.use(passport.authenticate("jwt", { session: false }));
router
  .route("/startsession")
  .post(gameRestriction,validateRequest(StartGameSessionSchema), StartSession);
router
  .route("/JoinSession")
  .patch(gameRestriction,validateRequest(JoinGameSessionSchema), joinSession);
router.route("/session/:sessionCode").get(gameRestriction,getSessionInfo);
router.route("/EndSession").patch(gameRestriction,EndSession);
router.route("/startMatch").patch(gameRestriction,startPlayMatch);
router.route("/currentQuestion/:sessionCode").get(gameRestriction,currentQuestion);
router
  .route("/submitAnswer")
  .patch(gameRestriction,validateRequest(SubmitAnswerSchema), SubmitAnswer);
router.route("/FetchScoreBoard/:sessionCode").get(gameRestriction,ScoreBoard);
// router
//   .route("/FiftyFiftyUse")
//   .patch(validateRequest(FiftyFiftyAidSchema), FiftyFiftyAid);
export default router;
