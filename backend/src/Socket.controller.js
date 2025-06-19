import { io } from "./index.js"; // Make sure to export 'io' from your server.js
import { GameSession } from "./model/GameSession.model.js";
import Question from "./model/questionAnswer.model.js";

// Handles client connection
export const handleConnection = (socket) => {
 

  // Join session room
  socket.on("join-session-room", (sessionCode) => {
    socket.join(sessionCode);

  });

  // Handle player joined event
  socket.on("player-joined", async ({ sessionCode, teamName, userId }) => {
    // Update DB (if needed) — though your API already handles this
    io.to(sessionCode).emit("update-session");
  });

  // Handle game started event
  socket.on("game-started", ({ sessionCode }) => {
    io.to(sessionCode).emit("game-started", {
      message: "Game has started!",
    });
  });

  // Handle game updated event
  socket.on("gameUpdated", async (sessionCode) => {
    try {
      const session = await GameSession.findOne({ sessionCode }).lean();
      const newQuestionId = session?.progress?.currentQuestionId;
      if (!newQuestionId) return;
  
      const newQuestion = await Question.findById(newQuestionId)
        .populate("categoryId", "_id name thumbnail")
        .lean();
  
      if (!newQuestion) return;
  
      const currentQuestionResponse = {
        questionId: newQuestion._id,
        points: newQuestion.points,
        QuestionImage: newQuestion.questionImage,
        questionText: newQuestion.questionText,
        answerImage: newQuestion.answerImage,
        options: newQuestion.options,
        Answer: newQuestion.answer,
        category: {
          id: newQuestion.categoryId._id,
          name: newQuestion.categoryId.name,
          thumbnail: newQuestion.categoryId.thumbnail,
        },
      };
   
  
      io.to(sessionCode).emit("chngeState", {
        session:session,
        currentQuestion: currentQuestionResponse,
      });
      
  
    } catch (error) {
      console.error("Error updating session on gameUpdated:", error);
    }
  });

  // Handle game end event
  socket.on("end-game", (sessionCode) => {

    io.to(sessionCode).emit("game-ended");
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
};
