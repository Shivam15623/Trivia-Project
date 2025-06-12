import { Router } from "express";
import {
  currentQuestion,
  EndSession,
  FiftyFiftyAid,
  getSessionInfo,
  getWaitingRoomInfo,
  joinSession,
  ScoreBoard,
  startPlayMatch,
  StartSession,
  SubmitAnswer,
} from "../controller/GameSession.controller.js";
import passport from "passport";
import { validateRequest } from "../middleware/validate.js";
import {
  FiftyFiftyAidSchema,
  JoinGameSessionSchema,
  StartGameSessionSchema,
  SubmitAnswerSchema,
} from "../validations/GameSessionSchema.js";
const router = Router();
// ✅ apply to all routes
router.use(passport.authenticate("jwt", { session: false }));

router
  .route("/startsession")
  .post(validateRequest(StartGameSessionSchema), StartSession);
router
  .route("/JoinSession")
  .patch(validateRequest(JoinGameSessionSchema), joinSession);
router.route("/session/:sessionCode").get(getSessionInfo);
router.route("/Waitingroom/:sessionCode").get(getWaitingRoomInfo);
router.route("/EndSession").patch(EndSession);
router.route("/startMatch").patch(startPlayMatch);
router.route("/currentQuestion/:sessionCode").get(currentQuestion);
router
  .route("/submitAnswer")
  .patch(validateRequest(SubmitAnswerSchema), SubmitAnswer);
router.route("/FetchScoreBoard/:sessionCode").get(ScoreBoard);
router
  .route("/FiftyFiftyUse")
  .patch(validateRequest(FiftyFiftyAidSchema), FiftyFiftyAid);
export default router;
