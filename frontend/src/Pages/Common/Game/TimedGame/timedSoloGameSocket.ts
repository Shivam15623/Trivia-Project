import {
  TimedSoloSocketConfig,
  GameSocketInstance,
  GamePhase,
  TimerStartPayload,
  TimeUpPayload,
  AnswerResultPayload,
  SubmitAck,
  RevealPayload,
  QuestionPayload,
} from "../types/timedSolo.types";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_UP_WAIT_FALLBACK_MS = 3_000; // if server never sends time-up
const GAME_END_FALLBACK_MS = 4_000; // if server never sends game-ended

export function createTimedSoloSocket(
  config: TimedSoloSocketConfig,
): GameSocketInstance {
  const {
    socket,
    sessionCode,

    onPhaseChange,
    onTick,
    onReveal,
    onGameEnd,
    onReconnecting,
    onError,
  } = config;

  // ─── Private state ─────────────────────────────────────────────────────────
  let phase: GamePhase = "IDLE";
  let expiresAt: number | null = null; // UTC epoch ms
  let durationMs: number = 0; // full duration for pct calc
  let currentQuestion: QuestionPayload | null = null;

  let rafHandle: number | null = null;
  let timeUpFallback: ReturnType<typeof setTimeout> | null = null;
  let gameEndFallback: ReturnType<typeof setTimeout> | null = null;

  // ─── Internal helpers ──────────────────────────────────────────────────────

  function setPhase(next: GamePhase): void {
    phase = next;
    onPhaseChange(next);
  }

  function stopRaf(): void {
    if (rafHandle !== null) {
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
    }
  }

  function clearTimeUpFallback(): void {
    if (timeUpFallback !== null) {
      clearTimeout(timeUpFallback);
      timeUpFallback = null;
    }
  }

  function clearGameEndFallback(): void {
    if (gameEndFallback !== null) {
      clearTimeout(gameEndFallback);
      gameEndFallback = null;
    }
  }

  // ─── rAF countdown loop ────────────────────────────────────────────────────
  // Uses expiresAt (UTC epoch ms) not a duration — self-corrects after
  // tab sleep, device suspend, or any JS timer drift.

  function startRaf(): void {
    stopRaf();

    function tick(): void {
      // Stop immediately if phase changed — no guard needed in caller
      if (phase !== "ACTIVE") return;

      const remainingMs = Math.max(0, (expiresAt ?? 0) - Date.now());
      const pct = durationMs > 0 ? remainingMs / durationMs : 0;

      onTick(remainingMs, pct);

      if (remainingMs <= 0) {
        onClientTimerEnd();
        return;
      }

      rafHandle = requestAnimationFrame(tick);
    }

    rafHandle = requestAnimationFrame(tick);
  }

  // ─── Client timer hit zero ─────────────────────────────────────────────────

  function onClientTimerEnd(): void {
    if (phase !== "ACTIVE") return; // guard: only from ACTIVE

    stopRaf();
    setPhase("TIME_UP_WAIT");

    // Fallback: if server time-up never arrives (socket blip), unblock after 3s
    timeUpFallback = setTimeout(() => {
      if (phase !== "TIME_UP_WAIT") return;
      handleReveal({
        isCorrect: false,
        correctAnswer: "",
        pointsAwarded: 0,
        nextQuestion: null,
        source: "timeout",
        answerImage: null, // ← no payload here, just null
      });
    }, TIME_UP_WAIT_FALLBACK_MS);
  }

  // ─── Reveal handler — single entry point for both paths ───────────────────

  function handleReveal(payload: RevealPayload): void {
    stopRaf();
    clearTimeUpFallback();
    setPhase("REVEALING");
    onReveal(payload);

    // If there's no next question, game is ending — arm fallback navigation
    if (!payload.nextQuestion) {
      gameEndFallback = setTimeout(() => {
        if (phase !== "REVEALING" && phase !== "ENDED") return;
        console.warn("[TimedSoloSocket] game-ended fallback fired");
        setPhase("ENDED");
        onGameEnd();
      }, GAME_END_FALLBACK_MS);
    }
  }

  // ─── Socket event handlers ─────────────────────────────────────────────────

  function onTimerStart(payload: TimerStartPayload): void {
    const { expiresAt: expiresAtIso, timer, currentQuestion: q } = payload;
    console.log("jdfnvbjdfnjvb", payload);
    // Reset all fallbacks from previous question
    stopRaf();
    clearTimeUpFallback();
    clearGameEndFallback();

    // Store deadline and question
    expiresAt = new Date(expiresAtIso).getTime();
    durationMs = timer * 1_000;
    currentQuestion = q;

    // Sanity: if expiresAt is already in the past (reconnect edge case)
    // jump straight to TIME_UP_WAIT — server will send time-up shortly
    if (expiresAt <= Date.now()) {
      console.warn(
        "[TimedSoloSocket] timer-start received but already expired",
      );
      setPhase("TIME_UP_WAIT");
      return;
    }

    setPhase("ACTIVE");
    startRaf();
  }

  function onTimeUp(payload: TimeUpPayload): void {
    // Guard: only valid from ACTIVE or TIME_UP_WAIT
    // Drop if SUBMITTING (answer-result owns the transition) or REVEALING
    if (phase !== "ACTIVE" && phase !== "TIME_UP_WAIT") {
      console.log(`[TimedSoloSocket] time-up dropped — phase=${phase}`);
      return;
    }

    clearTimeUpFallback();

    handleReveal({
      isCorrect: false,
      correctAnswer: payload.correctAnswer,
      pointsAwarded: 0,
      nextQuestion: payload.currentQuestion, // null = game over
      source: "timeout",
      answerImage: payload.answerImage ?? null, // ← add
    });
  }

  function onAnswerResult(payload: AnswerResultPayload): void {
    // Guard: only valid from SUBMITTING
    // If TIME_UP_WAIT already moved us, time-up event will handle reveal
    if (phase !== "SUBMITTING") {
      console.log(`[TimedSoloSocket] answer-result dropped — phase=${phase}`);
      return;
    }

    handleReveal({
      isCorrect: payload.isCorrect,
      correctAnswer: payload.correctAnswer,
      pointsAwarded: payload.pointsAwarded,
      nextQuestion: payload.nextQuestion,
      source: "answer",
      answerImage: payload.answerImage ?? null, // ← add
    });
  }

  function onGameEnded(): void {
    clearGameEndFallback();
    setPhase("ENDED");
    onGameEnd();
  }

  function onReconnect(): void {
    // Socket reconnected — if we were mid-game, tell server to re-sync us
    if (phase === "IDLE" || phase === "ENDED") return;

    onReconnecting();
    console.log("[TimedSoloSocket] reconnected — re-emitting player-ready");
    socket.emit("player-ready", { sessionCode });
    // Server case B: if timer running, unicasts timer-start back to this socket
    // That event will call onTimerStart and restart the rAF loop correctly
  }

  // ─── Register all listeners ────────────────────────────────────────────────

  socket.on("timer-start", onTimerStart);
  socket.on("time-up", onTimeUp);
  socket.on("answer-result", onAnswerResult);
  socket.on("game-ended", onGameEnded);
  socket.on("connect", onReconnect);

  // ─── Join room + signal ready ──────────────────────────────────────────────
  // join-session-room MUST come before player-ready
  // so the socket is in the room when the server broadcasts timer-start

  function joinAndReady() {
    socket.emit("join-session-room", sessionCode);
    socket.emit("player-ready", { sessionCode });
    console.log("[TimedSoloSocket] join + player-ready emitted");
  }

  // If socket is already connected (normal navigation) — emit immediately
  // If not connected yet (refresh / new tab) — wait for connect event
  if (socket.connected) {
    joinAndReady();
  } else {
    console.log("Reconnect One");
    socket.once("connect", joinAndReady);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  function submitAnswer(answerIndex: number, questionId: string): void {
    // Stamp answeredAt as the VERY FIRST thing — before any guard check
    const answeredAt = Date.now();

    // Guard: only allowed from ACTIVE
    if (phase !== "ACTIVE") {
      console.log(`[TimedSoloSocket] submitAnswer dropped — phase=${phase}`);
      return;
    }

    if (!currentQuestion) {
      onError("No active question to answer");
      return;
    }

    stopRaf();
    setPhase("SUBMITTING");

    const payload = {
      sessionCode,

      questionId,
      answer: currentQuestion.options[answerIndex], // send the string value
      answeredAt,
    };

    socket.emit("submit-answer", payload, (ack: SubmitAck) => {
      // Server acknowledged — but we wait for answer-result event
      // for the full reveal payload. Ack is just "I got it".

      if (ack.status === "duplicate" || ack.status === "stale") {
        // Already settled — server will send time-up, wait for it
        console.log(
          `[TimedSoloSocket] submit ack=${ack.status}, waiting for time-up`,
        );
        setPhase("TIME_UP_WAIT");
        return;
      }

      if (ack.status === "late") {
        // Timestamp rejected — treat as timeout
        console.log("[TimedSoloSocket] submit was late, treating as timeout");
        setPhase("TIME_UP_WAIT");
        return;
      }

      if (ack.status === "error") {
        onError("Failed to submit answer — please try again");
        setPhase("ACTIVE"); // let user retry
        startRaf(); // restart timer
        return;
      }

      // status === 'ok' — answer-result event will arrive shortly with
      // the full payload including nextQuestion. Do nothing here.
      // onAnswerResult handles the transition to REVEALING.
    });
  }
  function signalReady(): void {
    // Only valid from REVEALING — after reveal ends, tell server to arm next timer
    if (phase !== "REVEALING") return;
    socket.emit("player-ready", { sessionCode });
  }

  function destroy(): void {
    stopRaf();
    clearTimeUpFallback();
    clearGameEndFallback();

    socket.off("timer-start", onTimerStart);
    socket.off("time-up", onTimeUp);
    socket.off("answer-result", onAnswerResult);
    socket.off("game-ended", onGameEnded);
    socket.off("connect", onReconnect);
    socket.off("connect", joinAndReady); // ← remove pending once if not yet fired

    console.log("[TimedSoloSocket] destroyed");
  }
  return { submitAnswer, signalReady, destroy };
}
