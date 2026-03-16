import {
  currentQuestionData,
  GameSession,
} from "@/interfaces/GameSessionInterface";
// import { selectAuth } from "@/redux/AuthSlice/authSlice";
import {
  useSubmitAnswerMutation,
  useSubmitAnswerSoloMutation,
} from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { useCallback, useRef } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  pointsAwarded: number;
  answerImage: string;
}

interface UseGameSubmitProps {
  mode: string;
  sessionCode: string;
  sessionInfo: GameSession | undefined;
  questionData: currentQuestionData | undefined;
  selectedOption: string | null;
  hasSubmitted: boolean;
  setHasSubmitted: (v: boolean) => void;
  stopTimer: () => void;
  emitGameUpdated: () => void;
  emitGameEnd: () => void;
  setAnswerResult: (result: AnswerResult | null) => void;
  setQuestionData: (q: currentQuestionData) => void;
}

const preloadImage = (src: string | undefined | null): Promise<void> =>
  new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never reject — a missing image must not block the flow
  });

const ANSWER_DISPLAY_MS = 2500;

export const useGameSubmit = ({
  mode,
  sessionCode,
  sessionInfo,
  questionData,
  selectedOption,
  hasSubmitted,
  setHasSubmitted,
  stopTimer,
  emitGameUpdated,
  setQuestionData,
  setAnswerResult,
  emitGameEnd,
}: UseGameSubmitProps) => {
  const navigate = useNavigate();
  // const { user } = useSelector(selectAuth);

  const [submitTeam, { isLoading: isSubmittingTeam }] =
    useSubmitAnswerMutation();
  const [submitSolo, { isLoading: isSubmittingSolo }] =
    useSubmitAnswerSoloMutation();

  /**
   * Store a submission guard in a ref (not state) so we can check and set it
   * synchronously inside handleSubmit without waiting for a re-render.
   *
   * Problem this solves: if the user double-taps Submit, both calls enter the
   * async function before `hasSubmitted` (a state value) has updated. The ref
   * check is synchronous so the second call exits immediately.
   */
  const isSubmittingRef = useRef(false);

  const handleSubmit = useCallback(async () => {
    // ── Guards ────────────────────────────────────────────────────────────────
    if (!selectedOption || hasSubmitted || !sessionInfo || !questionData)
      return;

    // Synchronous double-submit guard (state updates are async, refs are not)
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    // Stop the visual timer immediately so it doesn't hit 0 and call onExpire
    // while we're mid-request.
    stopTimer();
    setHasSubmitted(true);

    try {
      // ── TEAM mode ───────────────────────────────────────────────────────────
      if (mode === "team") {
        const res = await submitTeam({
          sessionId: sessionInfo._id,
          questionId: questionData.questionId,
          answer: selectedOption,
        }).unwrap();

        if (!res.success) return;

        // Preload answer image while result overlay is showing
        await preloadImage(questionData.answerImage);

        if ("isCorrect" in res.data) {
          setAnswerResult({
            isCorrect: res.data.isCorrect,
            correctAnswer: res.data.correctAnswer,
            pointsAwarded: res.data.pointsAwarded,
            answerImage: questionData.answerImage,
          });
        }
        setTimeout(() => {
          setAnswerResult(null);
          // Let server drive the next state via socket after emitting
          if (res.data.gameEnded) {
            emitGameEnd();
          } else {
            emitGameUpdated();
          }
        }, ANSWER_DISPLAY_MS);

        // ── SOLO / TIMED_SOLO mode ──────────────────────────────────────────────
      } else {
        const res = await submitSolo({
          sessionId: sessionInfo._id,
          questionId: questionData.questionId,
          answer: selectedOption,
        }).unwrap();

        if (!res.success) return;

        // Game is over — navigate immediately, no overlay needed
        if (res.data.gameEnded) {
          navigate(`/game/SoloGameEnd/${sessionCode}`);
          return;
        }

        // Preload both images in parallel while the overlay is showing
        await Promise.all([
          preloadImage(questionData.answerImage),
          preloadImage(res.data.nextQuestion?.questionImage),
        ]);

        if ("isCorrect" in res.data) {
          setAnswerResult({
            isCorrect: res.data.isCorrect,
            correctAnswer: res.data.correctAnswer,
            pointsAwarded: res.data.pointsAwarded,
            answerImage: questionData.answerImage,
          });
        }

        setTimeout(() => {
          setAnswerResult(null);

          // Map API response field names → internal interface field names.
          // Keeping this mapping here (not in a transformer) makes the mismatch
          // explicit and easy to fix if the API changes.
          if ("nextQuestion" in res.data && res.data.nextQuestion) {
            setQuestionData({
              questionId: res.data.nextQuestion.questionId,
              Answer: res.data.nextQuestion.Answer,
              answerImage: res.data.nextQuestion.AnswerImage,
              category: res.data.nextQuestion.category,
              options: res.data.nextQuestion.options,
              points: res.data.nextQuestion.points,
              questionImage: res.data.nextQuestion.questionImage,
              questionText: res.data.nextQuestion.questionText,
            });
          }
        }, ANSWER_DISPLAY_MS);
      }
    } catch (err) {
      // Roll back optimistic UI so the player can try again
      setHasSubmitted(false);
      handleApiError(err);
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    mode,
    sessionCode,
    sessionInfo,
    questionData,
    selectedOption,
    hasSubmitted,
    stopTimer,
    setHasSubmitted,
    emitGameUpdated,
    setAnswerResult,
    setQuestionData,
    submitTeam,
    submitSolo,
    navigate,
    emitGameEnd,
  ]);

  return {
    handleSubmit,
    isSubmitting: isSubmittingTeam || isSubmittingSolo,
  };
};
