export const applyScoreIfCorrect = (
  session,
  teamIndex,
  isCorrect,
  pointValue,
  aid
) => {
  const currentMemberIndex = session.teams[teamIndex].currentMemberIndex;
  if (isCorrect) {
    if (aid === "twicePoint") {
      let twicevalue = pointValue * 2;
      session.teams[teamIndex].score += twicevalue;
      session.teams[teamIndex].members[currentMemberIndex].score += twicevalue;
    } else {
      session.teams[teamIndex].score += pointValue;
      session.teams[teamIndex].members[currentMemberIndex].score += pointValue;
    }
  }
};

export const applyScoreIfCorrectSolo = (session, isCorrect, pointValue) => {
  if (isCorrect) {
    session.score += pointValue;
  }
};
