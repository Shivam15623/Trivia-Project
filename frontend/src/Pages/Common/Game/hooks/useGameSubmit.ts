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
    img.onerror = () => resolve();
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
   * Synchronous double-submit guard — a ref so we can check and set it
   * without waiting for a re-render.
   */
  const isSubmittingRef = useRef(false);

  const handleSubmit = useCallback(async () => {
    // ── Guards ────────────────────────────────────────────────────────────────
    if (!selectedOption || hasSubmitted || !sessionInfo || !questionData)
      return;

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setHasSubmitted(true);

    try {
      // ── Team mode ─────────────────────────────────────────────────────────
      if (mode === "team") {
        const res = await submitTeam({
          sessionId: sessionInfo._id,
          questionId: questionData.questionId,
          answer: selectedOption,
        }).unwrap();

        if (!res.success) return;

        await preloadImage(questionData.answerImage);

        if ("isCorrect" in res.data) {
          setAnswerResult({
            isCorrect: res.data.isCorrect,
            correctAnswer: res.data.correctAnswer,
            pointsAwarded: res.data.pointsAwarded,
            answerImage: questionData.answerImage,
          });
        }

        /**
         * FIX: emitGameUpdated / emitGameEnd are ONLY called after the overlay
         * finishes (inside the timeout), never before.
         *
         * The original code called emitGameUpdated() immediately after the API
         * response, which caused the server to broadcast `chngeState` to all
         * clients while the answer overlay was still showing. That socket event
         * triggered setQuestionData → questionId changed → the reset effect in
         * useGameEngine wiped answerResult to null immediately, killing the overlay.
         *
         * By delaying both emits until after ANSWER_DISPLAY_MS, the overlay
         * always completes before the server drives any state change.
         */
        setTimeout(() => {
          setAnswerResult(null);
          if (res.data.gameEnded) {
            emitGameEnd();
          } else {
            emitGameUpdated();
          }
        }, ANSWER_DISPLAY_MS);

        // ── Solo mode ──────────────────────────────────────────────────────────
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

            setIsTransitioning(true);
            await preloadImage(nextQ.questionImage);
            await preloadImage(nextQ.answerImage);
            setQuestionData(nextQ);
            setIsTransitioning(false);
          }
        }, ANSWER_DISPLAY_MS);
      }
    } catch (err) {
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
