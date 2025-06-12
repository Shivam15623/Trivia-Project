import { currentQuestionData } from "@/interfaces/GameSessionInterface";

export const AnswerSection = ({
  currentQuestionData,
}: {
  currentQuestionData: currentQuestionData;
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 bg-[#fff6f0] p-6 rounded-xl shadow-lg border border-orange-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
        ✅ Correct Answer:
        <span className="block mt-2 text-[#e34b4b] text-2xl md:text-3xl font-extrabold">
          {currentQuestionData?.Answer}
        </span>
      </h2>

      {currentQuestionData?.answerImage && (
        <div className="w-full h-auto rounded-lg overflow-hidden border border-orange-300">
          <img
            src={currentQuestionData?.answerImage}
            alt="Answer Visual"
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-contain bg-white"
          />
        </div>
      )}
    </div>
  );
};
