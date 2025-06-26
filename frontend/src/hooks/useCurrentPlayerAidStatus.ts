// useCurrentPlayerAidStatus.ts
import { GameSession } from "@/interfaces/GameSessionInterface";

export const useCurrentPlayerAidStatus = (
  sessionInfo: GameSession | undefined,
  userId: string | undefined
) => {
  const teamIndex = sessionInfo?.progress?.currentTeamIndex;
  if (teamIndex === undefined || !sessionInfo || !userId) return null;

  const team = sessionInfo.teams[teamIndex];
  const player = team?.members[team.currentMemberIndex];
  const isCurrentPlayer = player?.userId === userId;

  if (!isCurrentPlayer) return null;

  return {
    isFiftyAvailable: !player.aids.fiftyFiftyUsed,
    isDeductAvailable: !player.aids.deductUsed,
    isTwiceAvailable: !player.aids.twicePointUsed,
    isCurrentPlayer,
  };
};
