import { useEffect } from "react";
import { FullSessionResponse, GameSession } from "@/interfaces/GameSessionInterface";

export const useSyncSessionData = (
  sessionSuccess: boolean,
  sessionInfoFromAPI: FullSessionResponse | undefined,
  setSessionInfo: (data: GameSession | undefined) => void
) => {
  useEffect(() => {
    if (sessionSuccess && sessionInfoFromAPI?.data) {
      setSessionInfo(sessionInfoFromAPI.data);
    } else if (!sessionInfoFromAPI?.data) {
      setSessionInfo(undefined);
    }
  }, [sessionSuccess, sessionInfoFromAPI, setSessionInfo]);
};
