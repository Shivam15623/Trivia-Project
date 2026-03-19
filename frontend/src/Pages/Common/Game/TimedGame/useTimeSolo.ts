// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   GameSession,
//   currentQuestionData,
// } from "@/interfaces/GameSessionInterface";
// import {
//   useFetchCurrentQuestionQuery,
//   useFetchGameSessionInfoQuery,
//   useSubmitAnswerSoloMutation,
// } from "@/services";
// import { useSocket } from "@/hooks/useSocket";
// import { useGameTimer } from "../hooks/useGameTimer";
// import { showError } from "@/components/toastUtills";

// // ─────────────────────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────────────────────

// /**
//  * Single source of truth for what the UI should render.
//  * No overlapping booleans — the component reads derived flags below,
//  * never this directly.
//  *
//  * loading       → API fetches in flight
//  * idle          → question loaded, waiting for server to arm timer
//  * countdown     → timer running, player can select + submit
//  * submitted     → socket emit sent, ack not yet received
//  * result        → answer overlay showing (2500ms then auto-advance)
//  * transitioning → overlay gone, next question images preloading
//  * locked        → time ran out before player submitted
//  * ended         → game over, navigating away
//  */
// export type GamePhase =
//   | "loading"
//   | "idle"
//   | "countdown"
//   | "submitted"
//   | "result"
//   | "transitioning"
//   | "locked"
//   | "ended";

// /**
//  * Visual state for each answer option button.
//  * Component calls getOptionState(option) and maps the string to a className.
//  * Zero game logic in JSX.
//  */
// export type OptionState =
//   | "default" // unselected, tappable
//   | "selected" // player tapped, not yet submitted
//   | "disabled" // not tappable right now
//   | "correct" // revealed as right answer (result/locked)
//   | "wrong_selected" // player picked this and it was wrong
//   | "loading"; // selected + submitted, waiting for ack (pulse animation)

// export interface AnswerResult {
//   isCorrect: boolean;
//   correctAnswer: string;
//   pointsAwarded: number;
//   answerImage: string;
//   timedOut: boolean; // "Time's Up!" vs "Correct!" vs "Wrong!" overlay copy
// }

// export type TimerColor = "gray" | "green" | "yellow" | "red" | "red-pulse";


// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────

// const ANSWER_DISPLAY_MS = 2500; // how long result overlay shows

// const PRELOAD_TIMEOUT_MS = 3000; // max wait per image before proceeding anyway

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// const preloadImage = (src: string | undefined | null): Promise<void> =>
//   new Promise((resolve) => {
//     if (!src) return resolve();
//     const t = setTimeout(resolve, PRELOAD_TIMEOUT_MS);
//     const img = new Image();
//     img.src = src;
//     img.onload = () => {
//       clearTimeout(t);
//       resolve();
//     };
//     img.onerror = () => {
//       clearTimeout(t);
//       resolve();
//     };
//   });

// // ─────────────────────────────────────────────────────────────────────────────
// // HOOK
// // ─────────────────────────────────────────────────────────────────────────────

// export const useTimedSolo = (sessionCode: string) => {
//   const navigate = useNavigate();
//   const socket = useSocket();
//   const { timeLeft, startTimer, stopTimer } = useGameTimer();

//   // ── 1. Fetch session ───────────────────────────────────────────────────────
//   // Same as your original — unchanged.
//   const [submitSolo, { isLoading: isSubmittingSolo }] =
//     useSubmitAnswerSoloMutation();
//   const {
//     data: sessionFromApi,
//     isLoading,
//     error,
//   } = useFetchGameSessionInfoQuery(sessionCode, {
//     skip: !sessionCode,
//     refetchOnMountOrArgChange: true,
//   });

//   const sessionBase = sessionFromApi?.data;
//   const sessionCodeValue = sessionBase?.sessionCode;

//   // ── 2. Fetch initial question ──────────────────────────────────────────────
//   // Same as your original — unchanged.
//   // After mount, questions are driven by socket events and submit acks only.
//   // This query handles first load and reconnect.

//   const { data: questionFromApi } = useFetchCurrentQuestionQuery(
//     sessionCodeValue as string,
//     {
//       skip: !sessionCodeValue,
//       refetchOnMountOrArgChange: true,
//     },
//   );

//   // ── 3. Session merge — same as your original ───────────────────────────────

//   const [sessionOverrides, setSessionOverrides] = useState<
//     Partial<GameSession>
//   >({});

//   const sessionInfo = useMemo(
//     () => (sessionBase ? { ...sessionBase, ...sessionOverrides } : undefined),
//     [sessionBase, sessionOverrides],
//   );

//   const patchSession = useCallback((patch: Partial<GameSession>) => {
//     setSessionOverrides((prev) => ({ ...prev, ...patch }));
//   }, []);

//   // ── 4. Phase — replaces your hasSubmitted, isUILocked, isTransitioning ─────
//   // One value instead of three booleans that could contradict each other.

//   const [phase, setPhase] = useState<GamePhase>("loading");

//   // ── 5. Question + selection — same as your original ───────────────────────

//   const [questionData, setQuestionData] = useState<
//     currentQuestionData | undefined
//   >();
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);

//   // ── 6. Refs ────────────────────────────────────────────────────────────────
//   //
//   // Why refs instead of state for these?
//   //
//   // Socket listeners are registered ONCE on mount and never re-registered.
//   // Their closures capture the values at registration time — always stale.
//   // Refs give them a live view of current values without needing re-registration.
//   //
//   // phaseRef       → lockUI and onTimeUp read current phase to decide what to do
//   // questionDataRef→ lockUI reads current question to build the answerResult
//   // The dedup refs → prevent double-emits and double-timer-starts

//   const phaseRef = useRef<GamePhase>("loading");
//   useEffect(() => {
//     phaseRef.current = phase;
//   }, [phase]);

//   const questionDataRef = useRef(questionData);
//   useEffect(() => {
//     questionDataRef.current = questionData;
//   }, [questionData]);

//   // Prevents double-starting the timer when API response (on reconnect)
//   // AND socket timer-start both carry the same startedAt value.
//   const lastSyncedStartedAt = useRef<string | null>(null);

//   // Prevents emitting player-ready more than once per questionId.
//   const readyEmittedForQuestion = useRef<string | null>(null);

//   // Synchronous double-submit guard.
//   // Phase check is not enough — React setState is async so a second tap
//   // in the same frame still sees the old phase. This ref check is sync.
//   const isSubmittingRef = useRef(false);

//   // Monotonically increasing counter. Each submit call captures its own id.
//   // Ack callback drops itself if the id no longer matches — covers the case
//   // where timeout rolled back the UI and the real ack arrives too late.
//   const submissionIdRef = useRef(0);

//   // Holds the ack-timeout handle so we can cancel it if ack arrives first.
//   const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ── 7. Seed question from API ──────────────────────────────────────────────
//   // Replaces your original useEffect that set questionData from questionFromApi.
//   // Added setPhase("idle") — when we have a question we're ready for the timer.

//   useEffect(() => {
//     if (!questionFromApi?.data) return;
//     setQuestionData(questionFromApi.data);
//     setPhase("idle");
//   }, [questionFromApi?.data?.questionId]);

//   // ── 8. Reset all per-question state when questionId changes ───────────────
//   //
//   // Every path that advances the question calls setQuestionData:
//   //   - API seed (above)
//   //   - submit ack nextQuestion
//   //   - time-up socket event
//   //
//   // So they all converge here. One reset, regardless of source.
//   // answerResult is intentionally reset here too — by the time questionId
//   // changes, the overlay setTimeout has already called setAnswerResult(null).
//   // Resetting it here is the safety net.

//   const resetForQuestion = useCallback(() => {
//     setSelectedOption(null);
//     setSelectedIndex(null);
//     setAnswerResult(null);
//     isSubmittingRef.current = false;
//     lastSyncedStartedAt.current = null;
//     setPhase("idle");
//   }, []);

//   useEffect(() => {
//     if (!questionData?.questionId) return;
//     resetForQuestion();
//   }, [questionData?.questionId]);

//   // ── 9. Emit player-ready once per question ────────────────────────────────
//   // Tells the server this client is ready.
//   // Server arms the timer and broadcasts timer-start.

//   useEffect(() => {
//     if (!sessionCode || !questionData?.questionId) return;
//     const qid = questionData.questionId.toString();
//     if (readyEmittedForQuestion.current === qid) return;
//     readyEmittedForQuestion.current = qid;
//     socket.emit("player-ready", { sessionCode });
//   }, [questionData?.questionId, sessionCode]);

//   // ── 10. Sync visual timer on reconnect ────────────────────────────────────
//   // Player refreshed mid-question — session arrives with startedAt already set.
//   // Restart visual countdown to stay in sync.
//   // NO onExpire — client timer is display only. Server drives all lock decisions.

//   useEffect(() => {
//     const timer = sessionInfo?.progress?.questionTimer;
//     if (!timer?.startedAt || !timer?.duration) return;
//     if (typeof timer.startedAt !== "string") return;
//     if (lastSyncedStartedAt.current === timer.startedAt) return;
//     lastSyncedStartedAt.current = timer.startedAt;
//     startTimer(timer.startedAt, timer.duration); // no onExpire — intentional
//     setPhase("countdown");
//   }, [sessionInfo?.progress?.questionTimer?.startedAt]);

//   // ── 11. Reconnect guard ───────────────────────────────────────────────────
//   // Player submitted then refreshed. attemptHistory already has this questionId.
//   // Restore locked state so they cannot submit again.

//   useEffect(() => {
//     if (!sessionInfo || !questionData) return;
//     const alreadyAnswered = sessionInfo.soloPlayer?.attemptHistory?.some(
//       (a) => a.questionId.toString() === questionData.questionId?.toString(),
//     );
//     if (alreadyAnswered && phaseRef.current !== "result") {
//       setPhase("locked");
//     }
//   }, [
//     sessionInfo?.soloPlayer?.attemptHistory?.length,
//     questionData?.questionId,
//   ]);

//   // ── 12. Navigate when session ends ────────────────────────────────────────

//   useEffect(() => {
//     if (sessionInfo?.status !== "completed") return;
//     setPhase("ended");
//     navigate(`/game/SoloGameEnd/${sessionCode}`);
//   }, [sessionInfo?.status, sessionCode, navigate]);

//   // ── 13. lockUI ────────────────────────────────────────────────────────────
//   //
//   // THE KEY RULE: called ONLY by the time-up socket handler.
//   // The client timer hitting 0 never calls this.
//   //
//   // Why "result" guard?
//   // Player submitted → ack arrived → phase = "result" overlay showing.
//   // Server then emits time-up (it was already in flight before atomic claim
//   // resolved on the server). That event is a ghost. Without this guard it
//   // would overwrite the player's correct result with a time's-up overlay.
//   //
//   // Why "submitted" is NOT guarded?
//   // Player submitted but server timer WON the atomic claim.
//   // Ack will arrive with reason:"time_up" and do nothing (see handleSubmit).
//   // lockUI takes over and shows the time's-up overlay — correct behaviour.

//   const lockUI = useCallback(
//     (nextQuestion: currentQuestionData) => {
//       if (phaseRef.current === "result") return; // ghost event, player already has result

//       stopTimer();
//       setPhase("locked");

//       const q = questionDataRef.current;
//       setAnswerResult({
//         isCorrect: false,
//         answerImage: q?.answerImage ?? "",
//         correctAnswer: q?.Answer ?? "",
//         pointsAwarded: 0,
//         timedOut: true,
//       });

//       // After overlay, advance to next question.
//       // resetForQuestion fires automatically via the questionId effect.
//       setTimeout(() => {
//         setAnswerResult(null);
//         setQuestionData(nextQuestion);
//       }, ANSWER_DISPLAY_MS);
//     },
//     [stopTimer],
//   );

//   // ── 14. Socket listeners ──────────────────────────────────────────────────

//   useEffect(() => {
//     if (!socket || !sessionCode) return;

//     socket.emit("join-session-room", sessionCode);

//     // Latency measurement.
//     // Server adds one-way latency as a grace buffer to its server-side timeout
//     // so the client visual countdown always hits 0 before the server cuts
//     // the question — giving the player a fair window to submit.
//     const onPing = ({ t1 }: { t1: number }) => socket.emit("pong", { t1 });

//     // Server armed the timer for this question.
//     // Start visual countdown — no onExpire, display only.
//     const onTimerStart = ({
//       startedAt,
//       timer,
//     }: {
//       startedAt: string;
//       timer: number;
//     }) => {
//       if (lastSyncedStartedAt.current === startedAt) return; // dedup reconnect
//       lastSyncedStartedAt.current = startedAt;
//       startTimer(startedAt, timer); // no onExpire — intentional
//       setPhase("countdown");
//     };

//     // Server says time is up.
//     // lockUI handles the "result" guard and all other phase cases internally.
//     const onTimeUp = ({
//       currentQuestion,
//     }: {
//       session: GameSession;
//       currentQuestion: currentQuestionData;
//     }) => {
//       lockUI(currentQuestion);
//     };

//     const onGameEnded = () => {
//       setPhase("ended");
//       navigate(`/game/SoloGameEnd/${sessionCode}`);
//     };

//     socket.on("ping", onPing);
//     socket.on("timer-start", onTimerStart);
//     socket.on("time-up", onTimeUp);
//     socket.on("game-ended", onGameEnded);

//     return () => {
//       socket.off("ping", onPing);
//       socket.off("timer-start", onTimerStart);
//       socket.off("time-up", onTimeUp);
//       socket.off("game-ended", onGameEnded);
//     };

//     // lockUI and navigate are stable (useCallback/useNavigate).
//     // Including them would re-register listeners on every render.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [socket, sessionCode]);

//   // ── 15. handleSubmit ──────────────────────────────────────────────────────

//   const handleSubmit = useCallback(async () => {
//     // ── Guards ─────────────────────────────────────────────────────────────────
//     if (!selectedOption || !sessionInfo || !questionData) return;
//     if (phaseRef.current !== "countdown") return; // wrong phase
//     if (isSubmittingRef.current) return; // synchronous double-tap guard
//     isSubmittingRef.current = true;

//     // Stamp FIRST — before stopTimer() or any async work.
//     // Server validates clientMs vs expiresAt (written before question started).
//     // Player who tapped in time is credited even if request arrives late.
//     // const submittedAt = Date.now();
//     const mySubmissionId = ++submissionIdRef.current;

//     stopTimer();
//     setPhase("submitted"); // button shows spinner, options disabled

//     try {
//       const res = await submitSolo({
//         sessionId: sessionInfo._id,
//         questionId: questionData.questionId,
//         answer: selectedOption,

//       }).unwrap();

//       // Stale response — a newer submission has taken over
//       // (e.g. user somehow re-submitted after a rollback)
//       if (submissionIdRef.current !== mySubmissionId) {
//         console.warn("[useTimedSolo] stale response dropped");
//         return;
//       }

//       isSubmittingRef.current = false;

//       // ── Game ended ───────────────────────────────────────────────────────────
//       if (res.data.gameEnded) {
//         setPhase("ended");
//         navigate(`/game/SoloGameEnd/${sessionCode}`);
//         return;
//       }

//       // ── Next question ────────────────────────────────────────────────────────
//       // res.data is submitAnswerDataSolo here (gameEnded: false)
//       const data = res.data;

//       // Build nextQ before any async work so it's captured in the closure
//       const nextQ = {
//         questionId: data.nextQuestion.questionId,
//         Answer: data.nextQuestion.Answer,
//         // API returns "AnswerImage" (capital A) — normalise to answerImage
//         answerImage: data.nextQuestion.AnswerImage,
//         category: data.nextQuestion.category,
//         options: data.nextQuestion.options,
//         points: data.nextQuestion.points,
//         questionImage: data.nextQuestion.questionImage,
//         questionText: data.nextQuestion.questionText,
//       };

//       // Preload runs in parallel with the overlay display time.
//       // Images will be cached by the time the overlay closes.
//       const preloadPromise = Promise.all([
//         preloadImage(questionData.answerImage), // shown in overlay right now
//         preloadImage(nextQ.questionImage),
//         preloadImage(nextQ.answerImage),
//       ]);

//       // Show overlay immediately — do not wait for images
//       setPhase("result");
//       setAnswerResult({
//         isCorrect: data.isCorrect,
//         correctAnswer: data.correctAnswer,
//         pointsAwarded: data.pointsAwarded,
//         answerImage: questionData.answerImage,
//         timedOut: false,
//       });

//       // Wait for BOTH full display time AND all preloads
//       await Promise.all([
//         preloadPromise,
//         new Promise<void>((r) => setTimeout(r, ANSWER_DISPLAY_MS)),
//       ]);

//       // Advance to next question — triggers questionId effect → resetForQuestion()
//       setPhase("transitioning");
//       setAnswerResult(null);
//       setQuestionData(nextQ);
//     } catch (err: unknown) {
//       // Stale check — don't rollback if a newer submission took over
//       if (submissionIdRef.current !== mySubmissionId) return;

//       isSubmittingRef.current = false;

//       // Check if server explicitly said time was up
//       // RTK Query wraps server errors in err.data
//       const status = (err as { status?: number })?.status;
//       const reason = (err as { data?: { message?: string } })?.data?.message;

//       if (status === 400 && reason?.toLowerCase().includes("already")) {
//         // Server returned 400 "Question already answered or session inactive"
//         // This means the server timer won the atomic claim.
//         // time-up socket event is already in-flight → lockUI() will fire.
//         // DO NOT touch phase — lockUI owns the UI from this point.
//         return;
//       }

//       // Any other error — roll back so player can try again
//       setPhase("countdown");
//      showError("Something went wrong — please try again");
//     }
//   }, [
//     selectedOption,
//     sessionInfo,
//     questionData,
//     sessionCode,
//     stopTimer,
//     submitSolo,
//     navigate,
//   ]);

//   // ── 16. getOptionState ────────────────────────────────────────────────────
//   // All option visual logic lives here. Component maps result to className.

//   const getOptionState = useCallback(
//     (option: string): OptionState => {
//       const isSelected = selectedOption === option;
//       switch (phase) {
//         case "idle":
//         case "countdown":
//           return isSelected ? "selected" : "default";
//         case "submitted":
//           return isSelected ? "loading" : "disabled";
//         case "result":
//         case "locked":
//           if (!answerResult) return "disabled";
//           if (option === answerResult.correctAnswer) return "correct";
//           if (isSelected) return "wrong_selected";
//           return "disabled";
//         default:
//           return "disabled";
//       }
//     },
//     [phase, selectedOption, answerResult],
//   );

//   // ── 17. Timer color ───────────────────────────────────────────────────────

//   const duration = sessionInfo?.progress?.questionTimer?.duration ?? 30;

//   const timerColor: TimerColor =
//     timeLeft === null
//       ? "gray"
//       : timeLeft === 0 && phase === "countdown"
//         ? "red-pulse" // at 0, waiting for server
//         : timeLeft > duration * 0.5
//           ? "green"
//           : timeLeft > duration * 0.25
//             ? "yellow"
//             : "red";

//   // ── 18. Derived UI flags ──────────────────────────────────────────────────
//   // Component reads these — never reads phase directly.

//   const canSelect = phase === "countdown" || phase === "idle";
//   const canSubmit = phase === "countdown" && selectedOption !== null;
//   const showSpinner = phase === "submitted";
//   const showOverlay = phase === "result" || phase === "locked";
//   const showSkeleton = phase === "loading" || phase === "transitioning";
//   const timerPulsing = timeLeft === 0 && phase === "countdown";

//   // ── 19. Safe option selector ──────────────────────────────────────────────

//   const handleSelectOption = useCallback(
//     (option: string, index: number) => {
//       if (!canSelect) return;
//       setSelectedOption(option);
//       setSelectedIndex(index);
//     },
//     [canSelect],
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // RETURN
//   // ─────────────────────────────────────────────────────────────────────────

//   return {
//     // API state
//     isLoading,
//     error,

//     // Phase — expose for dev tools / analytics only.
//     // Component should read derived flags below.
//     phase,

//     // Question
//     questionData,
//     sessionInfo,

//     // Selection
//     selectedOption,
//     selectedIndex,
//     handleSelectOption,

//     // Per-option visual state — call per option: getOptionState(option)
//     getOptionState,

//     // Submit
//     handleSubmit,

//     // UI flags — component reads these, not phase
//     canSelect,
//     canSubmit,
//     showSpinner,
//     showOverlay,
//     showSkeleton,

//     // Timer
//     timeLeft,
//     timerColor,
//     timerPulsing,
//     showTimer: true,

//     // Overlay data
//     answerResult,

 
//   };
// };
