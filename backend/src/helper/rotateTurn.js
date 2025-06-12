export const rotateTurn = (session) => {
    const currentTeamIndex = session.progress.currentTeamIndex;
    const nextTeamIndex = currentTeamIndex === 0 ? 1 : 0;
  
    // move to next player in current team
    session.teams[currentTeamIndex].currentMemberIndex =
      (session.teams[currentTeamIndex].currentMemberIndex + 1) %
      session.teams[currentTeamIndex].members.length;
  
    session.progress.currentTeamIndex = nextTeamIndex;
  };
  