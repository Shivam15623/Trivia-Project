import { ApiError } from "../utills/ApiError.js";
const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
export const getNextQuestion = (session) => {
  const pointLevel = session.progress.currentPointLevel;
  const teamIndex = session.progress.currentTeamIndex;

  const candidates = session.questionPool.filter(
    (q) => !q.used && q.points === pointLevel && q.teamIndex === teamIndex,
  );

  if (candidates.length === 0) {
    if (pointLevel < 600) {
      session.progress.currentPointLevel += 200;
      return getNextQuestion(session);
    } else {
      return { status: "ended" };
    }
  }

  const entry = getRandomItem(candidates);

  return { status: "next", nextQuestionEntry: entry };
};
export const getNextQuestionSolo = (session) => {
  const pointLevel = session.progress.currentPointLevel;

  const candidates = session.questionPool.filter(
    (q) => !q.used && q.points === pointLevel,
  );

  if (candidates.length === 0) {
    // move to next point level
    if (pointLevel < 600) {
      session.progress.currentPointLevel += 200;
      return getNextQuestionSolo(session);
    } else {
      return { status: "ended" };
    }
  }

  const entry = getRandomItem(candidates);

  return { status: "next", nextQuestionEntry: entry };
};
