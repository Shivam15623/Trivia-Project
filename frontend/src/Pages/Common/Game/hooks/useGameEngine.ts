import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GameSession,
  currentQuestionData,
} from "@/interfaces/GameSessionInterface";
import {
  useFetchCurrentQuestionQuery,
  useFetchGameSessionInfoQuery,
} from "@/services";
import { useGameSocket } from "./useGameSocket";
import { useGameSubmit } from "./useGameSubmit";

export const useGameEngine = (sessionCode: string) => {
  const navigate = useNavigate();

  // ── Core state ───────────────────────────────────────────────────────────────
  const [sessionOverrides, setSessionOverrides] = useState<
    Partial<GameSession>
  >({});
  const [questionData, setQuestionData] = useState<
    currentQuestionData | undefined
  >();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    pointsAwarded: number;
    answerImage: string;
  } | null>(null);

  /**
   * Tracks whether the answer overlay is currently visible.
   * Stored as a ref (not state) so useGameSocket can read the latest value
   * synchronously inside its event listener without a stale closure.
   * Updated in the setAnswerResult wrappers below.
   */
  const isShowingAnswerRef = useRef(false);

  const showAnswerResult = useCallback(
    (result: Parameters<typeof setAnswerResult>[0]) => {
      isShowingAnswerRef.current = result !== null;
      setAnswerResult(result);
    },
    [],
  );

  // ── 1. Fetch session ─────────────────────────────────────────────────────────
  const {
    data: sessionFromApi,
    isLoading,
    error,
  } = useFetchGameSessionInfoQuery(sessionCode, {
    skip: !sessionCode,
    refetchOnMountOrArgChange: true,
  });

  const sessionBase = sessionFromApi?.data;
  const mode = sessionBase?.mode;

  // Merge server state with local socket patches
  const sessionInfo = useMemo(
    () => (sessionBase ? { ...sessionBase, ...sessionOverrides } : undefined),
    [sessionBase, sessionOverrides],
  );

  const sessionCodeValue = sessionBase?.sessionCode;

  const { data: questionFromApi } = useFetchCurrentQuestionQuery(
    sessionCodeValue as string,
    {
      skip: !sessionCodeValue,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (questionFromApi) setQuestionData(questionFromApi.data);
  }, [questionFromApi]);

  // ── 2. Session patch (stable setter for socket callbacks) ────────────────────
  const patchSession = useCallback(
    (
      updater:
        | GameSession
        | ((prev: GameSession | undefined) => Partial<GameSession>),
    ) => {
      setSessionOverrides((prev) => ({
        ...prev,
        ...(typeof updater === "function" ? updater(sessionInfo) : updater),
      }));
    },
    [sessionInfo],
  );

  // ── 3. Socket ────────────────────────────────────────────────────────────────
  const { emitGameUpdated, emitGameEnd } = useGameSocket({
    mode: mode ?? "",
    sessionCode,
    setSessionInfo: patchSession,
    setQuestionData,
    onGameEnded: () => {
      if (sessionInfo?.mode === "team") {
        navigate(`/game/endgame/${sessionCode}`);
      } else {
        navigate(`/game/SoloGameEnd/${sessionCode}`);
      }
    },
    setIsTransitioning,
    isShowingAnswerRef,
  });

  // ── 4. Submit ────────────────────────────────────────────────────────────────
  const { handleSubmit, isSubmitting } = useGameSubmit({
    mode: mode ?? "",
    sessionCode,
    sessionInfo,
    questionData,
    selectedOption,
    hasSubmitted,
    setHasSubmitted,
    emitGameUpdated,
    setQuestionData,
    setAnswerResult: showAnswerResult,
    emitGameEnd,
    setIsTransitioning,
  });

  // ── 5. Reset UI on question change ───────────────────────────────────────────
  useEffect(() => {
    setSelectedOption(null);
    setSelectedIndex(null);
    setHasSubmitted(false);
    // Do NOT reset answerResult here — useGameSubmit clears it via setTimeout
    // after the overlay has shown. Resetting it here is what caused the overlay
    // to disappear prematurely when a new question arrived via socket.
  }, [questionData?.questionId]);

  // ── 6. Navigate when session completes ───────────────────────────────────────
  useEffect(() => {
    if (sessionInfo?.status !== "completed") return;

    if (sessionInfo.mode === "team") {
      navigate(`/game/endgame/${sessionCode}`);
    } else {
      navigate(`/game/SoloGameEnd/${sessionCode}`);
    }
  }, [sessionInfo?.status, sessionInfo?.mode, sessionCode, navigate]);

  return {
    sessionInfo,
    questionData,
    isLoading,
    error,
    selectedOption,
    selectedIndex,
    setSelectedOption,
    setSelectedIndex,
    handleSubmit,
    isSubmitting,
    hasSubmitted,
    showTurnBanner: mode === "team",
    answerResult,
    emitGameEnd,
    isTransitioning,
  };
};
