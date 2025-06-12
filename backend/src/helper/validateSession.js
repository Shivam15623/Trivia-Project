import { ApiError } from "../utills/ApiError.js";

export const validateSession = async (session, userId) => {
  if (!session) {
    throw new ApiError(404, "Session does not exist");
  }

  if (session.status !== "active") {
    throw new ApiError(400, "Session is not active");
  }

  const currentTeamIndex = session.progress.currentTeamIndex;
  const currentTeam = session.teams[currentTeamIndex];

  const currentPlayer = currentTeam.members[currentTeam.currentMemberIndex];

  if (userId.toString() !== currentPlayer.userId.toString()) {
    throw new ApiError(400, "It's not your turn");
  }

  return {
    session,
    currentTeam,
    currentPlayer,
    currentTeamIndex,
  };
};
