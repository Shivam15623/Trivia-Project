import { Button } from "@/components/ui/button";
import {
  useCurrentQuestionSoloQuery,
  useSubmitAnswerSoloMutation,
} from "@/services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "@/utills/handleApiError";
import CategoryCard from "./CategoryCard";

const PlaySoloGame = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    data: currentQuestionData,
    isFetching,
    refetch: refetchCurrentQuestion,
  } = useCurrentQuestionSoloQuery(sessionId!);

  const [submitAnswer, { isLoading: isSubmitting }] =
    useSubmitAnswerSoloMutation();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const showLoader = isFetching || isSubmitting;

  const handleSubmit = async () => {
    if (
      !selectedOption ||
      hasSubmitted ||
      !sessionId ||
      !currentQuestionData?.data.questionId
    )
      return;

    try {
      setHasSubmitted(true);

      const response = await submitAnswer({
        sessionId,
        answer: selectedOption,
        questionId: currentQuestionData.data.questionId,
      }).unwrap();

      if (response.success === true) {
        if (response.data.gameEnded) {
          navigate(`/game/SoloGameEnd/${sessionId}`);
        } else {
          refetchCurrentQuestion();
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
  }, [currentQuestionData?.data?.questionId]);

  return (
    <section className="px-4 py-6 sm:px-6 w-full h-full min-h-[100vh] bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="mx-auto md:w-11/12 lg:w-3/4">
        <div className="flex flex-col gap-6">
          {currentQuestionData?.data.category && (
            <div className="w-full md:w-9/12 mx-auto flex-col md:flex gap-6">
              <CategoryCard categoryData={currentQuestionData.data.category} />
            </div>
          )}

          <div className="w-full md:w-9/12 mx-auto relative">
            {/* 🔄 Unified loader during submit or fetch */}
            {showLoader && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm bg-orange-50 bg-opacity-60 pointer-events-none transition-all">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-1 rounded-full border-2 border-orange-300 opacity-50 animate-ping" />
                </div>
                <p className="text-orange-600 font-semibold text-sm sm:text-base animate-pulse">
                  Loading next question...
                </p>
              </div>
            )}

            <div
              className={`bg-white rounded-2xl shadow-lg p-1 sm:p-6 flex flex-col gap-6 border-[5px] border-[#e34b4b] ${
                showLoader ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="w-full max-w-2xl mx-auto space-y-2 sm:space-y-3.5 md:space-y-6">
                <h2 className="text-md sm:text-lg md:text-3xl mt-5 font-bold text-gray-800 text-center text-balance">
                  {currentQuestionData?.data.questionText}
                </h2>

                {currentQuestionData?.data.QuestionImage && (
                  <div className="mb-2 md:mb-4">
                    <img
                      key={currentQuestionData?.data.questionId}
                      src={currentQuestionData?.data.QuestionImage}
                      alt="Question Visual"
                      loading="lazy"
                      className="w-full h-[253px] sm:h-[350px] md:h-[400px] rounded-b-lg object-contain"
                    />
                  </div>
                )}

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1 sm:p-0 items-stretch">
                  {currentQuestionData?.data.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          if (!hasSubmitted && !showLoader) {
                            setSelectedOption(option);
                          }
                        }}
                        className={`p-2 sm:p-4 flex items-center justify-center text-sm sm:text-lg text-center border-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-700 shadow-md"
                            : "bg-white hover:bg-blue-100 border-blue-300 text-gray-800"
                        }`}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedOption || showLoader}
                  className={`transition-all mb-2 sm:mb-0 duration-200 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg ${
                    !selectedOption || showLoader
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 active:scale-95"
                  }`}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaySoloGame;
