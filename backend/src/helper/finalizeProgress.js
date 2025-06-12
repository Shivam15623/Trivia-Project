export const finalizeProgress = async (session, currentTeamIndex) => {
    session.markModified(`teams.${currentTeamIndex}.currentMemberIndex`);
    session.markModified("progress.currentTeamIndex");
    await session.save();
  };