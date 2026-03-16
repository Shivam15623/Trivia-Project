import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useGameTimer
 *
 * Race-condition-proof countdown that syncs to a server `startedAt` + `duration`.
 *
 * Guarantees:
 *  - Each startTimer call gets a unique generation id. Ticks/expiry from a
 *    superseded generation are silently dropped.
 *  - onExpire is stored in a ref so it is always the latest closure, never stale.
 *  - stopTimer invalidates the generation before clearing the interval, so a
 *    tick queued in the same event-loop turn can never fire onExpire after stop.
 *  - Unmount is fully safe.
 */
export const useGameTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generationRef = useRef<number>(0);
  const onExpireRef = useRef<(() => void) | undefined>(undefined);

  const clearTimerInternal = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      generationRef.current++;
      clearTimerInternal();
    };
  }, [clearTimerInternal]);

  /**
   * Start (or restart) the countdown.
   * @param startedAt  ISO string from the server
   * @param duration   Total duration in seconds
   * @param onExpire   Called exactly once when remaining hits 0
   */
  const startTimer = useCallback(
    (startedAt: string, duration: number, onExpire?: () => void) => {
      const myGeneration = ++generationRef.current;

      clearTimerInternal();
      setTimeLeft(null); // prevent stale value flash on question change

      onExpireRef.current = onExpire;

      const startMs = new Date(startedAt).getTime();
      if (Number.isNaN(startMs)) {
        console.warn("[useGameTimer] Invalid startedAt:", startedAt);
        return;
      }

      intervalRef.current = setInterval(() => {
        if (generationRef.current !== myGeneration) return; // stale tick

        const elapsed = (Date.now() - startMs) / 1000;
        const remaining = Math.max(0, duration - elapsed);

        setTimeLeft(Math.ceil(remaining));

        if (remaining <= 0) {
          generationRef.current++; // invalidate before calling onExpire
          clearTimerInternal();
          onExpireRef.current?.();
        }
      }, 500);
    },
    [clearTimerInternal],
  );

  /**
   * Stop the timer and clear the display.
   * Safe to call when no timer is running.
   */
  const stopTimer = useCallback(() => {
    generationRef.current++;
    clearTimerInternal();
    setTimeLeft(null);
  }, [clearTimerInternal]);

  return { timeLeft, startTimer, stopTimer };
};
