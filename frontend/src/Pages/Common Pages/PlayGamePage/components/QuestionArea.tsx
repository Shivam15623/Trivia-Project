import { Button } from "@/components/ui/button";
import {
  currentQuestionData,
  GameSession,
} from "@/interfaces/GameSessionInterface";
import { useSubmitAnswerMutation } from "@/services";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Socket } from "socket.io-client";
import OtherUserDisplay from "./otherUserDisplay";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import logError from "@/utills/logError";
interface QuestionSectionProp {
  currentQuestionData: currentQuestionData;
  sessionInfo: GameSession;
  socket: Socket;
  aid: "Deduct" | "None" | "twicePoint";
}
const QuestionSection = ({
  currentQuestionData,
  socket,
  sessionInfo,
  aid,
}: QuestionSectionProp) => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTurnOverlay, setShowTurnOverlay] = useState(false);
  const [showAnswerSection, setShowAnswerSection] = useState(false);
  const [submitAnswer] = useSubmitAnswerMutation();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const currentTeamIndex = sessionInfo.progress?.currentTeamIndex;
  const teams = sessionInfo?.teams;

  const currentTurn = useMemo(() => {
    const currentTeamIndex = sessionInfo?.progress?.currentTeamIndex;
    const currentTeam =
      currentTeamIndex !== undefined
        ? sessionInfo?.teams[currentTeamIndex]
        : undefined;
    const currentMemberIndex = currentTeam?.currentMemberIndex;

    return {
      teamName: currentTeam?.name || "",
      playerName:
        currentTeam?.members?.[currentMemberIndex || 0]?.username || "",
    };
  }, [sessionInfo]);

  const isCurrentPlayer = useMemo(() => {
    if (teams && typeof currentTeamIndex === "number") {
      const currentTeam = teams[currentTeamIndex];
      const currentMemberIndex = currentTeam?.currentMemberIndex;
      const currentPlayerId = currentTeam?.members[currentMemberIndex].userId;
      return currentPlayerId === userId;
    }
    return false;
  }, [teams, currentTeamIndex, userId]);

  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
  }, [currentQuestionData?.questionId]);

  useEffect(() => {
    if (currentTurn) {
      setShowTurnOverlay(true);
      setTimeout(() => {
        setShowTurnOverlay(false);
      }, 2000); // 2 seconds duration for the overlay
    }
    setShowAnswerSection(false);
  }, [
    sessionInfo.progress.currentTeamIndex,
    currentQuestionData.questionId,
    currentTurn,
  ]);

  const handleSubmit = async () => {
    if (!selectedOption || hasSubmitted) return;
    if (!sessionInfo || !currentQuestionData) return;

    try {
      const response = await submitAnswer({
        aid: aid,
        sessionId: sessionInfo._id,
        questionId: currentQuestionData.questionId,
        answer: selectedOption!,
      }).unwrap();

      setHasSubmitted(true);
      if (response.success === true) {
        setShowAnswerSection(true);
        setTimeout(() => {
          socket?.emit("gameUpdated", sessionCode);
        }, 3000);
      }
    } catch (err) {
      logError(err);
    }
  };

  return (
    <div>
      {showTurnOverlay && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="text-white text-4xl font-extrabold text-center">
            <div>
              <span className="block text-2xl">
                {currentTurn?.playerName || "A Player"}'s Turn from
              </span>
              <span className="text-orange-600 font-bold text-3xl">
                {currentTurn?.teamName || "Team"}
              </span>
              <span className="block text-sm text-gray-300 mt-2">
                Get ready for the next question!
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {isCurrentPlayer ? (
        <>
          <span className="absolute top-0 left-0 md:hidden transform -translate-x-2 -translate-y-4 px-3 py-1.5 text-sm font-bold bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white rounded-full shadow-xl">
            {currentQuestionData?.category.name}
          </span>
          <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-4 px-3 py-1.5 text-sm md:translate-x-4 sm:-translate-y-4 md:px-4 md:py-2 md:text-lg font-bold bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white rounded-full shadow-xl">
            {currentQuestionData?.points || 10} pts
          </span>

          {showAnswerSection ? (
            <div className="w-full max-w-2xl mx-auto space-y-6 bg-[#fff6f0] sm:p-6 rounded-xl shadow-lg border border-orange-200">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                ✅ Correct Answer:
                <span className="block mt-2 text-[#e34b4b] text-2xl md:text-3xl font-extrabold">
                  {currentQuestionData.Answer}
                </span>
              </h2>

              {currentQuestionData?.answerImage && (
                <div className="w-full h-auto rounded-lg overflow-hidden border border-orange-300">
                  <img
                    src={currentQuestionData?.answerImage}
                    alt="Answer Visual"
                    className="w-full h-[253px] sm:h-[350px] md:h-[400px] object-contain bg-white"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto  space-y-2 sm:space-y-3.5 md:space-y-6">
              <h2 className="text-md sm:text-lg md:text-3xl mt-5 sm:mt-3 md:mt-0 font-bold text-gray-800 text-center text-balance">
                {currentQuestionData?.questionText}
              </h2>

              {currentQuestionData?.QuestionImage && (
                <div className="mb-2 md:mb-4">
                  <img
                    key={currentQuestionData.questionId}
                    src={currentQuestionData.QuestionImage}
                    alt="Question Visual"
                    loading="lazy"
                    className="w-full h-[253px] sm:h-[350px] md:h-[400px] rounded-b-lg object-contain overflow-hidden"
                  />
                </div>
              )}

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1 sm:p-0 items-stretch">
                {currentQuestionData?.options.map(
                  (option: string, index: number) => {
                    const isSelected = selectedOption === option;

                    return (
                      <li
                        key={index}
                        onClick={() => {
                          if (!hasSubmitted) setSelectedOption(option);
                        }}
                        className={`p-2 sm:p-4 flex items-center justify-center text-sm sm:text-lg leading-3 text-center border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-700 shadow-md"
                            : "bg-white hover:bg-blue-100 border-blue-300 text-gray-800"
                        }`}
                      >
                        {option}
                      </li>
                    );
                  }
                )}
              </ul>

              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`transition-all mb-2 sm:mb-0 duration-200 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg ${
                  !selectedOption
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 active:scale-95"
                }`}
              >
                Submit Answer
              </Button>
            </div>
          )}
        </>
      ) : (
        <OtherUserDisplay
          currentTurn={currentTurn!}
          currentQuestionData={currentQuestionData!}
        />
      )}
    </div>
  );
};

export default QuestionSection;
