export const evaluateAnswer = (correctAnswer, submittedAnswer) => {
    return correctAnswer.toLowerCase().trim() === submittedAnswer.toLowerCase().trim();
  };
  