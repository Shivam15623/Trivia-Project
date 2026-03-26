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

// const TIME_UP_WAIT_FALLBACK_MS = 3_000;
const GAME_END_FALLBACK_MS = 4_000;
let clockOffsetMs = 0; // positive = client is ahead of server

function serverNow(): number {
  return Date.now() - clockOffsetMs;
}
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

  let phase: GamePhase = "IDLE";
  let expiresAt: number | null = null;
  let durationMs: number = 0;
  let currentQuestion: QuestionPayload | null = null;

  let rafHandle: number | null = null;
  let timeUpFallback: ReturnType<typeof setTimeout> | null = null;
  let gameEndFallback: ReturnType<typeof setTimeout> | null = null;

  function setPhase(next: GamePhase): void {
    console.log(`[Socket] phase  ${phase} → ${next}`);
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
      console.log(`[Socket] timeUpFallback cleared`);
    }
  }

  function clearGameEndFallback(): void {
    if (gameEndFallback !== null) {
      clearTimeout(gameEndFallback);
      gameEndFallback = null;
      console.log(`[Socket] gameEndFallback cleared`);
    }
  }

  function startRaf(): void {
    stopRaf();
    console.log(
      `[Socket] rAF started  expiresAt=${new Date(expiresAt ?? 0).toISOString()}`,
    );

    function tick(): void {
      if (phase !== "ACTIVE") return;
      const remainingMs = Math.max(0, (expiresAt ?? 0) - serverNow()); // ← serverNow()
      const pct = durationMs > 0 ? remainingMs / durationMs : 0;
      onTick(remainingMs, pct, remainingMs <= 0); // ← pass waiting flag

      if (remainingMs <= 0) {
        stopRaf();
        return; // stay ACTIVE, server owns the transition
      }

      rafHandle = requestAnimationFrame(tick);
    }

    rafHandle = requestAnimationFrame(tick);
  }

  // function onClientTimerEnd(): void {
  //   if (phase !== "ACTIVE") return;
  //   console.log(`[Socket] client timer ended — moving to TIME_UP_WAIT`);
  //   stopRaf();
  //   setPhase("TIME_UP_WAIT");

  //   timeUpFallback = setTimeout(() => {
  //     if (phase !== "TIME_UP_WAIT") return;
  //     console.warn(
  //       `[Socket] timeUpFallback fired — server never sent time-up, faking reveal`,
  //     );
  //     handleReveal({
  //       isCorrect: false,
  //       correctAnswer: "",
  //       pointsAwarded: 0,
  //       nextQuestion: null,
  //       source: "timeout",
  //       answerImage: null,
  //     });
  //   }, TIME_UP_WAIT_FALLBACK_MS);

  //   console.log(
  //     `[Socket] timeUpFallback armed  fallbackMs=${TIME_UP_WAIT_FALLBACK_MS}`,
  //   );
  // }

  function handleReveal(payload: RevealPayload): void {
    console.log(
      `[Socket] handleReveal  source=${payload.source}  isCorrect=${payload.isCorrect}  nextQuestion=${payload.nextQuestion?.questionId ?? "null"}`,
    );
    stopRaf();
    clearTimeUpFallback();
    setPhase("REVEALING");
    onReveal(payload);

    if (!payload.nextQuestion) {
      console.log(
        `[Socket] no nextQuestion — arming gameEndFallback  ms=${GAME_END_FALLBACK_MS}`,
      );
      gameEndFallback = setTimeout(() => {
        if (phase !== "REVEALING" && phase !== "ENDED") return;
        console.warn(`[Socket] gameEndFallback fired`);
        setPhase("ENDED");
        onGameEnd();
      }, GAME_END_FALLBACK_MS);
    }
  }

  function onTimerStart(payload: TimerStartPayload): void {
    console.log(
      `[Socket] timer-start received  questionId=${payload.currentQuestion?.questionId}  expiresAt=${payload.expiresAt}  timer=${payload.timer}s  currentPhase=${phase}`,
    );
    stopRaf();
    clearTimeUpFallback();
    clearGameEndFallback();

    expiresAt = new Date(payload.expiresAt).getTime();
    durationMs = payload.timer * 1_000;
    currentQuestion = payload.currentQuestion;

    const msUntilExpiry = expiresAt - serverNow();
    console.log(
      `[Socket] timer-start  msUntilExpiry=${msUntilExpiry}  (${(msUntilExpiry / 1000).toFixed(2)}s remaining)`,
    );

    if (expiresAt <= serverNow()) {
      console.warn(
        `[Socket] timer-start already expired — jumping to TIME_UP_WAIT`,
      );
      setPhase("TIME_UP_WAIT");
      return;
    }

    setPhase("ACTIVE");
    startRaf();
  }

  function onTimeUp(payload: TimeUpPayload): void {
    console.log(
      `[Socket] time-up received  currentPhase=${phase}  correctAnswer="${payload.correctAnswer}"  nextQuestion=${payload.currentQuestion?.questionId ?? "null (game over)"}`,
    );

    if (phase !== "ACTIVE" && phase !== "TIME_UP_WAIT") {
      console.log(
        `[Socket] time-up DROPPED — phase=${phase} is not ACTIVE or TIME_UP_WAIT`,
      );
      return;
    }

    clearTimeUpFallback();
    handleReveal({
      isCorrect: false,
      correctAnswer: payload.correctAnswer,
      pointsAwarded: 0,
      nextQuestion: payload.currentQuestion,
      source: "timeout",
      answerImage: payload.answerImage ?? null,
    });
  }

  function onAnswerResult(payload: AnswerResultPayload): void {
    console.log(
      `[Socket] answer-result received  currentPhase=${phase}  isCorrect=${payload.isCorrect}  points=${payload.pointsAwarded}  nextQuestion=${payload.nextQuestion?.questionId ?? "null (game over)"}`,
    );

    if (phase !== "SUBMITTING") {
      console.log(
        `[Socket] answer-result DROPPED — phase=${phase} is not SUBMITTING`,
      );
      return;
    }

    handleReveal({
      isCorrect: payload.isCorrect,
      correctAnswer: payload.correctAnswer,
      pointsAwarded: payload.pointsAwarded,
      nextQuestion: payload.nextQuestion,
      source: "answer",
      answerImage: payload.answerImage ?? null,
    });
  }

  function onGameEnded(): void {
    console.log(`[Socket] game-ended received`);
    clearGameEndFallback();
    setPhase("ENDED");
    onGameEnd();
  }

  function onReconnect(): void {
    if (phase === "IDLE" || phase === "ENDED") {
      console.log(`[Socket] connect event — phase=${phase}, ignoring`);
      return;
    }
    console.log(
      `[Socket] reconnected mid-game  phase=${phase} — re-emitting player-ready`,
    );
    onReconnecting();
    socket.emit("player-ready", { sessionCode });
  }

  const onPing = ({ t1 }: { t1: number }) => {
    console.log(`[Socket] ping received  t1=${t1} — sending pong`);
    socket.emit("pong", { t1 });
  };
  const onPongAck = ({
    t1,
    serverNow: serverTs,
  }: {
    t1: number;
    serverNow: number;
  }) => {
    const rtt = Date.now() - t1;
    const latency = rtt / 2;
    clockOffsetMs = Date.now() - latency - serverTs;
    console.log(
      `[Socket] clockOffset=${clockOffsetMs}ms  latency=${latency}ms`,
    );
  };
  function onSocketError(payload: { message: string }): void {
    console.warn(
      `[Socket] server error received  message="${payload.message}"`,
    );
    onError(payload.message);
  }

  socket.on("ping", onPing);
  socket.on("pong-ack", onPongAck);
  socket.on("timer-start", onTimerStart);
  socket.on("time-up", onTimeUp);
  socket.on("answer-result", onAnswerResult);
  socket.on("game-ended", onGameEnded);
  socket.on("connect", onReconnect);
  socket.on("error", onSocketError);

  function joinAndReady() {
    console.log(
      `[Socket] joinAndReady  session=${sessionCode}  socketId=${socket.id}`,
    );
    socket.emit("join-session-room", sessionCode);
    socket.emit("player-ready", { sessionCode });
  }

  if (socket.connected) {
    console.log(`[Socket] socket already connected — joining immediately`);
    joinAndReady();
  } else {
    console.log(
      `[Socket] socket not connected yet — waiting for connect event`,
    );
    socket.once("connect", joinAndReady);
  }

  function submitAnswer(answerIndex: number, questionId: string): void {
    const answeredAt = Date.now();
    console.log(
      `[Socket] submitAnswer  answerIndex=${answerIndex}  questionId=${questionId}  phase=${phase}  answeredAt=${answeredAt}`,
    );

    if (phase !== "ACTIVE") {
      console.log(`[Socket] submitAnswer DROPPED — phase=${phase}`);
      return;
    }

    if (!currentQuestion) {
      console.warn(`[Socket] submitAnswer — no currentQuestion`);
      onError("No active question to answer");
      return;
    }

    const answer = currentQuestion.options[answerIndex];
    console.log(`[Socket] submitAnswer  answer="${answer}"`);

    stopRaf();
    setPhase("SUBMITTING");

    const payload = { sessionCode, questionId, answer, answeredAt };

    socket.emit("submit-answer", payload, (ack: SubmitAck) => {
      console.log(`[Socket] submit-answer ack  status=${ack.status}`);

      if (ack.status === "duplicate" || ack.status === "stale") {
        console.log(`[Socket] ack=${ack.status} — moving to TIME_UP_WAIT`);
        setPhase("TIME_UP_WAIT");
        return;
      }
      if (ack.status === "late") {
        console.log(`[Socket] ack=late — moving to TIME_UP_WAIT`);
        setPhase("TIME_UP_WAIT");
        return;
      }
      if (ack.status === "error") {
        console.warn(`[Socket] ack=error — reverting to ACTIVE`);
        onError("Failed to submit answer — please try again");
        setPhase("ACTIVE");
        startRaf();
        return;
      }
      console.log(`[Socket] ack=ok — waiting for answer-result event`);
    });
  }

  function signalReady(): void {
    console.log(`[Socket] signalReady called  phase=${phase}`);
    if (phase !== "REVEALING") {
      console.warn(
        `[Socket] signalReady DROPPED — phase=${phase} is not REVEALING`,
      );
      return;
    }
    console.log(`[Socket] signalReady — emitting player-ready`);
    socket.emit("player-ready", { sessionCode });
  }

  function destroy(): void {
    console.log(`[Socket] destroy called`);
    stopRaf();
    clearTimeUpFallback();
    clearGameEndFallback();

    socket.off("timer-start", onTimerStart);
    socket.off("time-up", onTimeUp);
    socket.off("answer-result", onAnswerResult);
    socket.off("game-ended", onGameEnded);
    socket.off("connect", onReconnect);
    socket.off("connect", joinAndReady);
    socket.off("error", onSocketError);
    console.log(`[Socket] destroyed — all listeners removed`);
  }

  return { submitAnswer, signalReady, destroy };
}
