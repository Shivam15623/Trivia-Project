export const markQuestionAndPlayerUsed = (questionEntry, player) => {
    questionEntry.used = true;
    player.hasAnswered = true;
  };
  