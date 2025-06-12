
import { ApiError } from "../utills/ApiError.js";
export const getNextQuestion = (session) => {
    const teamIndex = session.progress.currentTeamIndex;
    const pointLevel = session.progress.currentPointLevel;
    const category = session.progress.currentCategory;
  
    // 1. Try current level and category
    let entry = session.questionPool.find(
      (q) =>
        !q.used &&
        q.teamIndex === teamIndex &&
        q.points === pointLevel &&
        q.category.toString() === category.toString()
    );
  
    // 2. Try next point level
    if (!entry && pointLevel < 600) {
      session.progress.currentPointLevel += 200;
      entry = session.questionPool.find(
        (q) =>
          !q.used &&
          q.teamIndex === teamIndex &&
          q.points === session.progress.currentPointLevel &&
          q.category.toString() === category.toString()
      );
    }
  
    // 3. Change category if still not found
    if (!entry && session.progress.currentPointLevel === 600) {
      if (!session.usedCategories.includes(category.toString())) {
        session.usedCategories.push(category.toString());
      }
  
      const availableCategories = session.questionPool
        .filter(
          (q) =>
            !q.used && !session.usedCategories.includes(q.category.toString())
        )
        .map((q) => q.category.toString());
  
      const uniqueCategories = [...new Set(availableCategories)];
      if (uniqueCategories.length === 0) {
        // 👉 Game has ended
        return { status: "ended" };
      }
  
      session.progress.currentCategory = uniqueCategories[0];
      session.progress.currentPointLevel = 200;
  
      entry = session.questionPool.find(
        (q) =>
          !q.used &&
          q.teamIndex === teamIndex &&
          q.points === session.progress.currentPointLevel &&
          q.category.toString() === session.progress.currentCategory.toString()
      );
    }
  
    if (!entry) {
      // 👉 Nothing found for the new category either
      return { status: "ended" };
    }
  
    return { status: "next", nextQuestionEntry: entry };
  };
  export const getNextQuestionSolo=(session)=>{
    const pointLevel = session.progress.currentPointLevel;
    const category = session.progress.currentCategory;
    let entry = session.questionPool.find(
      (q) =>
        !q.used &&
        q.points === pointLevel &&
        q.category.toString() === category.toString()
    );
  
    // 2. Try next point level
    if (!entry && pointLevel < 600) {
      session.progress.currentPointLevel += 200;
      entry = session.questionPool.find(
        (q) =>
          !q.used &&
          q.points === session.progress.currentPointLevel &&
          q.category.toString() === category.toString()
      );
    }
  
    // 3. Change category if still not found
    if (!entry && session.progress.currentPointLevel === 600) {
      if (!session.usedCategories.includes(category.toString())) {
        session.usedCategories.push(category.toString());
      }
  
      const availableCategories = session.questionPool
        .filter(
          (q) =>
            !q.used && !session.usedCategories.includes(q.category.toString())
        )
        .map((q) => q.category.toString());
  
      const uniqueCategories = [...new Set(availableCategories)];
      if (uniqueCategories.length === 0) {
        // 👉 Game has ended
        return { status: "ended" };
      }
  
      session.progress.currentCategory = uniqueCategories[0];
      session.progress.currentPointLevel = 200;
  
      entry = session.questionPool.find(
        (q) =>
          !q.used &&
          q.points === session.progress.currentPointLevel &&
          q.category.toString() === session.progress.currentCategory.toString()
      );
    }
  
    if (!entry) {
      // 👉 Nothing found for the new category either
      return { status: "ended" };
    }
  
    return { status: "next", nextQuestionEntry: entry };
  }