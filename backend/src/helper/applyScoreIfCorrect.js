// Apply score for team mode
export const applyScoreIfCorrect = (
  session,
  teamIndex,
  isCorrect,
  pointValue,
) => {
  if (!isCorrect) return;

  const memberIndex = session.teams[teamIndex].currentMemberIndex;
  const member = session.teams[teamIndex].members[memberIndex];

  member.score += pointValue;
  session.teams[teamIndex].score += pointValue;

  session.markModified(`teams.${teamIndex}.members.${memberIndex}.score`);
  session.markModified(`teams.${teamIndex}.score`);
};

// Apply score for solo mode
export const applyScoreIfCorrectSolo = (session, isCorrect, pointValue) => {
  if (!isCorrect) return;
  session.soloPlayer.score += pointValue;
  session.markModified("soloPlayer.score");
};
