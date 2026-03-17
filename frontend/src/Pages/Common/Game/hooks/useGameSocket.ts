import { useEffect, useRef } from "react";
import {
  GameSession,
  currentQuestionData,
} from "@/interfaces/GameSessionInterface";
import { useSocket } from "@/hooks/useSocket";

interface UseGameSocketProps {
  mode: string;
  sessionCode: string;
  setSessionInfo: (
    s: GameSession | ((prev: GameSession | undefined) => Partial<GameSession>),
  ) => void;
  setQuestionData: (q: currentQuestionData) => void;
  onTimerStart: (startedAt: string, duration: number) => void;
  onTimeUp: () => void;
  onGameEnded: () => void;
  setIsTransitioning: (v: boolean) => void;
}

export const useGameSocket = ({
  mode,
  sessionCode,
  setSessionInfo,
  setQuestionData,
  onTimerStart,
  onTimeUp,
  onGameEnded,
  setIsTransitioning,
}: UseGameSocketProps) => {
  const socket = useSocket();

  /**
   * All callbacks live in a ref so socket listeners registered once on mount
   * always call the *latest* version of each function. This is the standard
   * pattern for using callbacks inside long-lived event listeners without
   * stale closure bugs.
   *
   * We update the ref on EVERY render (no dep array) — this is intentional and
   * correct; the ref update itself does not cause a re-render.
   */
  const cbRef = useRef({
    setSessionInfo,
    setQuestionData,
    onTimerStart,
    onTimeUp,
    onGameEnded,
    setIsTransitioning, // ✅ new
  });

  // Update ref every render so listeners always call the latest callbacks
  useEffect(() => {
    cbRef.current = {
      setSessionInfo,
      setQuestionData,
      onTimerStart,
      onTimeUp,
      onGameEnded,
      setIsTransitioning, // ✅ new
    };
  });

  useEffect(() => {
    if (!socket || !mode || !sessionCode) return;

    socket.emit("join-session-room", sessionCode);

    // ── Listeners registered once; they read latest callbacks via cbRef ──────

    const onPing = ({ t1 }: { t1: number }) => socket.emit("pong", { t1 });

    const onGameEnded = () => cbRef.current.onGameEnded();

    socket.on("ping", onPing);
    socket.on("game-ended", onGameEnded);

    const cleanup: (() => void)[] = [
      () => socket.off("ping", onPing),
      () => socket.off("game-ended", onGameEnded),
    ];

    // ── Team mode ─────────────────────────────────────────────────────────────
    if (mode === "team") {
      const onStateChange = ({
        session,
        currentQuestion,
      }: {
        session: GameSession;
        currentQuestion: currentQuestionData;
      }) => {
        cbRef.current.setIsTransitioning(true);
        cbRef.current.setSessionInfo(session);
        cbRef.current.setQuestionData(currentQuestion);

        // Emit player-ready once per unique question
        // const incomingId = currentQuestion.questionId?.toString();
        // if (incomingId && incomingId !== lastQuestionIdRef.current) {
        //   lastQuestionIdRef.current = incomingId;
        //   socket.emit("player-ready", { sessionCode });
        // }
        cbRef.current.setIsTransitioning(false);
      };

      socket.on("chngeState", onStateChange);
      cleanup.push(() => socket.off("chngeState", onStateChange));
    }

    // ── Timed modes ───────────────────────────────────────────────────────────
    if (mode === "team" || mode === "timed_solo") {
      const onTimerStart = ({
        startedAt,
        timer,
      }: {
        startedAt: string;
        timer: number;
      }) => cbRef.current.onTimerStart(startedAt, timer - 1);

      /**
       * time-up arrives with the next question data already attached.
       * We call onTimeUp immediately (so the UI locks / shows wrong-answer
       * overlay), then after a 2-second delay we update the session and
       * question so the overlay has time to display before the screen changes.
       */
      const onTimeUp = ({
        session,
        currentQuestion,
      }: {
        session: GameSession;
        currentQuestion: currentQuestionData;
      }) => {
        cbRef.current.onTimeUp();

        setTimeout(() => {
            cbRef.current.setIsTransitioning(true);
          if (session) cbRef.current.setSessionInfo(session);
          if (currentQuestion) cbRef.current.setQuestionData(currentQuestion);
            cbRef.current.setIsTransitioning(false);
        }, 2000);
      };

      socket.on("timer-start", onTimerStart);
      socket.on("time-up", onTimeUp);

      cleanup.push(
        () => socket.off("timer-start", onTimerStart),
        () => socket.off("time-up", onTimeUp),
      );
    }

    return () => cleanup.forEach((fn) => fn());

    // socket, mode, and sessionCode are the only values that should cause
    // listeners to be re-registered. Callback changes are handled via cbRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, mode, sessionCode]);

  const emitGameUpdated = () => socket?.emit("gameUpdated", sessionCode);
  const emitGameEnd = () => socket?.emit("end-game", sessionCode);

  return { emitGameUpdated, emitGameEnd };
};
