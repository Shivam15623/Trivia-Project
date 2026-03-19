import {
  currentQuestionData,
  GameSession,
} from "@/interfaces/GameSessionInterface";
import {
  useSubmitAnswerMutation,
  useSubmitAnswerSoloMutation,
} from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { useCallback, useRef } from "react";
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
  setIsTransitioning: (v: boolean) => void;
}

const preloadImage = (src: string | undefined | null): Promise<void> =>
  new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never reject — a missing image must not block the flow
  });

// Must match the delay used in useGameSocket's onTimeUp handler so overlays
// are never cleared before they've had time to display.
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
  setIsTransitioning,
}: UseGameSubmitProps) => {
  const navigate = useNavigate();

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
          // FIX Bug 7: was emitting emitGameUpdated() BOTH immediately and
          // inside this timeout. Only emit once — after the overlay clears.
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

        if (res.data.gameEnded) {
          navigate(`/game/SoloGameEnd/${sessionCode}`);
          return;
        }

        // Preload answer image (shown in overlay)
        await preloadImage(questionData.answerImage);

        if ("isCorrect" in res.data) {
          setAnswerResult({
            isCorrect: res.data.isCorrect,
            correctAnswer: res.data.correctAnswer,
            pointsAwarded: res.data.pointsAwarded,
            answerImage: questionData.answerImage,
          });
        }

        setTimeout(async () => {
          setAnswerResult(null);

          if ("nextQuestion" in res.data && res.data.nextQuestion) {
            const nextQ: currentQuestionData = {
              questionId: res.data.nextQuestion.questionId,
              Answer: res.data.nextQuestion.Answer,
              answerImage: res.data.nextQuestion.AnswerImage,
              category: res.data.nextQuestion.category,
              options: res.data.nextQuestion.options,
              points: res.data.nextQuestion.points,
              questionImage: res.data.nextQuestion.questionImage,
              questionText: res.data.nextQuestion.questionText,
            };

            // Show skeleton FIRST, preload THEN reveal
            setIsTransitioning(true);
            await preloadImage(nextQ.questionImage);
            await preloadImage(nextQ.answerImage);
            setQuestionData(nextQ);
            setIsTransitioning(false); // image is ready, now show it
          }
        }, ANSWER_DISPLAY_MS);
      }
    } catch (err) {
      // Roll back optimistic UI so the player can try again
      setHasSubmitted(false);
      handleApiError(err);
    } finally {
      // FIX Bug 10: always reset the ref — even on the lockUI / time-up path.
      // Without this, a race where the server fires time-up just as the user
      // taps Submit can leave isSubmittingRef permanently true.
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
    setIsTransitioning,
  ]);

  return {
    handleSubmit,
    isSubmitting: isSubmittingTeam || isSubmittingSolo,
  };
};
