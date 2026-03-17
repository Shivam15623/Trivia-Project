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
import { useGameTimer } from "./useGameTimer";
import { useGameSocket } from "./useGameSocket";
import { useGameSubmit } from "./useGameSubmit";
import { useSocket } from "@/hooks/useSocket";

export const useGameEngine = (sessionCode: string) => {
  const navigate = useNavigate();
  const socket = useSocket();

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

  // ── 3. Timer ─────────────────────────────────────────────────────────────────
  const { timeLeft, startTimer, stopTimer } = useGameTimer();

  /**
   * lockUI: called when time expires (either by the client timer or by the
   * server's time-up socket event).
   *
   * We store questionData in a ref so lockUI always sees the *current* question
   * even though it is defined with useCallback (capturing stale closures was
   * the original bug here).
   */
  const questionDataRef = useRef(questionData);
  useEffect(() => {
    questionDataRef.current = questionData;
  }, [questionData]);

  const hasSubmittedRef = useRef(hasSubmitted);
  useEffect(() => {
    hasSubmittedRef.current = hasSubmitted;
  }, [hasSubmitted]);

  const lockUI = useCallback(() => {
    // Guard: if the player already submitted before the timer fired, do nothing.
    // Without this, lockUI (called by the timer's onExpire) would overwrite the
    // correct answerResult that the submit path already set.
    if (hasSubmittedRef.current) return;

    stopTimer();
    setHasSubmitted(true);

    // Show "time's up" result using the ref — not the closure-captured value —
    // so we always have the current question's data.
    const q = questionDataRef.current;
    setAnswerResult({
      isCorrect: false,
      answerImage: q?.answerImage ?? "",
      correctAnswer: q?.Answer ?? "",
      pointsAwarded: 0,
    });
  }, [stopTimer]); // stopTimer is stable (useCallback with no deps that change)

  // ── 4. Session patch (stable setter for socket callbacks) ────────────────────
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

  // ── 5. Socket ────────────────────────────────────────────────────────────────
  const { emitGameUpdated, emitGameEnd } = useGameSocket({
    mode: mode ?? "",
    sessionCode,
    setSessionInfo: patchSession,
    setQuestionData,
    onTimerStart: startTimer,

    /**
     * onTimeUp is called by the socket when the SERVER's timer fires.
     *
     * We delegate entirely to lockUI which already guards against double-firing
     * (hasSubmittedRef check). The socket then delivers the next question data
     * 2 seconds later via setSessionInfo / setQuestionData (handled in
     * useGameSocket's onTimeUp handler), which triggers the question-change
     * effect below to reset UI state.
     */
    onTimeUp: lockUI,

    onGameEnded: () => {
      if (sessionInfo?.mode === "team") {
        navigate(`/game/endgame/${sessionCode}`);
      } else {
        navigate(`/game/SoloGameEnd/${sessionCode}`);
      }
    },
  });

  // ── 6. Submit ────────────────────────────────────────────────────────────────
  const { handleSubmit, isSubmitting } = useGameSubmit({
    mode: mode ?? "",
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
  });

  // ── 7. Emit player-ready for timed_solo ──────────────────────────────────────
  /**
   * We track the last questionId we emitted for in a ref to prevent
   * re-emitting on re-renders that don't change the question.
   */
  const readyRef = useRef<string | null>(null);

  useEffect(() => {
    if (mode !== "timed_solo" || !questionData?.questionId) return;

    const qid = questionData.questionId.toString();
    if (readyRef.current === qid) return;

    readyRef.current = qid;
    socket.emit("player-ready", { sessionCode });
  }, [mode, questionData?.questionId, sessionCode, socket]);

  // ── 8. Sync server timer from session (handles page refresh / reconnect) ─────
  /**
   * If the session arrives from the API with an active timer already running
   * (e.g. the player refreshed mid-question), we restart the client timer so
   * the countdown is in sync.
   */
  useEffect(() => {
    const timer = sessionInfo?.progress?.questionTimer;
    if (!timer?.startedAt || !timer?.duration) return;
    if (typeof timer.startedAt !== "string") return;

    startTimer(timer.startedAt, timer.duration, lockUI);

    // We only want to re-run this when startedAt changes (new question armed)
    // — NOT when lockUI changes identity (which would restart the timer on every
    // render). lockUI is stable anyway, but the explicit dep list makes that
    // contract clear.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionInfo?.progress?.questionTimer?.startedAt,
    sessionInfo?.progress?.questionTimer?.duration,
  ]);

  // ── 9. Reset UI on question change ───────────────────────────────────────────
  useEffect(() => {
    setSelectedOption(null);
    setSelectedIndex(null);
    setHasSubmitted(false);
    setAnswerResult(null);
  }, [questionData?.questionId]);

  // ── 10. Navigate when session completes ──────────────────────────────────────
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
    timeLeft,
    showTimer: mode === "team" || mode === "timed_solo",
    showTurnBanner: mode === "team",
    answerResult,
    emitGameEnd,
    isTransitioning,
  };
};
