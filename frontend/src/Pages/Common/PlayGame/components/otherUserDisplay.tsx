import { currentQuestionData } from "@/interfaces/GameSessionInterface";
import { CurrentTurn } from "..";


interface otherUserDisplayProp {
  currentTurn: CurrentTurn;
  currentQuestionData: currentQuestionData;
}
const OtherUserDisplay = ({
  currentQuestionData,
  currentTurn,
}: otherUserDisplayProp) => {
  const questionText =
    currentQuestionData?.questionText ?? "Loading question...";
  const questionImage = currentQuestionData?.QuestionImage;

  return (
    <div className="text-center text-gray-800 w-full max-w-2xl mx-auto space-y-2 sm:space-y-3.5 md:space-y-6">
      {/* Info about who is currently playing */}
      <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-lg inline-block shadow-sm">
        {currentTurn?.playerName || "A player"} from team{" "}
        <span className="text-orange-600 font-bold">
          {currentTurn?.teamName || "Team"}
        </span>{" "}
        is answering...
      </div>

      {/* Always show the question, or fallback while loading */}
      <h2 className="text-md sm:text-lg md:text-2xl lg:text-3xl mt-5 sm:mt-3 md:mt-0 font-bold text-gray-800 text-center text-balance">
        {questionText}
      </h2>

      {/* Optional image if it exists */}
      {questionImage && (
        <div className="w-full h-auto max-w-xl mx-auto rounded-lg overflow-hidden border border-gray-200">
          <img
            src={questionImage}
            alt="Question Visual"
            className="w-full h-[253px] sm:h-[350px] md:h-[400px] rounded-b-lg object-contain overflow-hidden"
          />
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">
        You will be able to answer once it's your turn.
      </p>
    </div>
  );
};

export default OtherUserDisplay;
