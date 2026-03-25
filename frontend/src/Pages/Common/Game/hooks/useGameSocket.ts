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
    updater:
      | GameSession
      | ((prev: GameSession | undefined) => Partial<GameSession>),
  ) => void;
  setQuestionData: (q: currentQuestionData) => void;
  onGameEnded: () => void;
  setIsTransitioning: (v: boolean) => void;
  /**
   * A ref that is `true` while the answer-result overlay is visible.
   * When set, `chngeState` events are held and applied only after the
   * overlay clears, preventing the incoming question from wiping the overlay.
   */
  isShowingAnswerRef: React.MutableRefObject<boolean>;
}

export const useGameSocket = ({
  mode,
  sessionCode,
  setSessionInfo,
  setQuestionData,
  onGameEnded,
  setIsTransitioning,
  isShowingAnswerRef,
}: UseGameSocketProps) => {
  const socket = useSocket();

  const cbRef = useRef({
    setSessionInfo,
    setQuestionData,
    onGameEnded,
    setIsTransitioning,
    isShowingAnswerRef,
  });

  useEffect(() => {
    cbRef.current = {
      setSessionInfo,
      setQuestionData,
      onGameEnded,
      setIsTransitioning,
      isShowingAnswerRef,
    };
  });

  useEffect(() => {
    if (!socket || !mode || !sessionCode) return;

    socket.emit("join-session-room", sessionCode);

    // ── Shared listeners ─────────────────────────────────────────────────────

    const onPing = ({ t1 }: { t1: number }) => {
      socket.emit("pong", { t1 });
    };

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
        /**
         * FIX (second layer of defence): if the answer overlay is still
         * showing when this event arrives, defer applying the new state until
         * the overlay window has passed. This handles edge cases where network
         * latency causes `chngeState` to arrive before the emit timeout fires
         * (e.g. another player submitted right after this one).
         *
         * Primary fix is in useGameSubmit (emit only after overlay). This is
         * a safety net so the overlay is never killed by a socket event.
         */
        const apply = () => {
          cbRef.current.setSessionInfo(session);
          cbRef.current.setQuestionData(currentQuestion);
        };

        if (cbRef.current.isShowingAnswerRef.current) {
          // Wait for the overlay to clear before updating state
          const OVERLAY_GUARD_MS = 2600; // just over ANSWER_DISPLAY_MS
          setTimeout(apply, OVERLAY_GUARD_MS);
        } else {
          apply();
        }
      };

      socket.on("chngeState", onStateChange);
      cleanup.push(() => socket.off("chngeState", onStateChange));
    }

    return () => cleanup.forEach((fn) => fn());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, mode, sessionCode]);

  const emitGameUpdated = () => socket?.emit("gameUpdated", sessionCode);
  const emitGameEnd = () => socket?.emit("end-game", sessionCode);

  return { emitGameUpdated, emitGameEnd };
};
