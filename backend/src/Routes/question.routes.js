import { Router } from "express";
import passport from "passport";
import { upload } from "../middleware/multer.js";
import {
  addQuestionToCategory,
  deleteQuestion,
  fetchQuestionById,
  getQuestionsByCategory,
  updateQuestion,
} from "../controller/question.controller.js";
import { validateRequest } from "../middleware/validate.js";
import { QuestionSchema } from "../validations/QuestionSchema.js";
const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.route("/AddQuestion").post(
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "answerImage", maxCount: 1 },
  ]),
  validateRequest(QuestionSchema),
  addQuestionToCategory
);
router.route("/getQuestionsByCategory/:slug").get(getQuestionsByCategory);
router.route("/updateQuestion/:questionId").patch(
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "answerImage", maxCount: 1 },
  ]),
  validateRequest(QuestionSchema),
  updateQuestion
);

router.route("/deleteQuestion/:questionId").delete(deleteQuestion);
router.route("/fetchQuestionById/:questionId").get(fetchQuestionById);
export default router;
