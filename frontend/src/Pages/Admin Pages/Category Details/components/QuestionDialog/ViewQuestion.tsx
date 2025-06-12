import { DialogWrapper } from "@/components/DialogWrapper";
import { Badge } from "@/components/ui/badge";
import { useFetchQuestionByIdQuery } from "@/services";
import { ViewIcon } from "lucide-react";

const ViewQuestion = ({ questionId }: { questionId: string }) => {
  const {
    data: questiondata,
    isLoading,
    isError,
  } = useFetchQuestionByIdQuery(questionId);

  return (
    <DialogWrapper
      title="View Question"
      description="Here you can view the details of the question."
      dialogClassName="max-w-2xl"
      icon={<ViewIcon />}
      variant="outline"
      triggerLabel=""
      type="info"
      size="xl"
    >
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">Error fetching question data.</div>
      )}

      <div className="space-y-2">
        <div className="font-semibold text-lg">
          {questiondata?.data.questionText}
        </div>
        <div className="space-x-2">
          {questiondata?.data.options.map((option, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="px-3 py-1 bg-gray-100 text-gray-800"
            >
              {option}
            </Badge>
          ))}
        </div>
        <div className="mt-2 font-medium text-gray-800">
          <span className="text-gray-500">Answer: </span>
          <span className="text-[#e34b4b] font-bold">
            {questiondata?.data.answer}
          </span>
        </div>
        <div className="mt-2 font-medium text-gray-800">
          <span className="text-gray-500">Points: </span>
          <span className="text-blue-600">{questiondata?.data.points}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-4">
        <div className="w-full h-[300px]">
          <img
            src={questiondata?.data.questionImage}
            alt="Question Image"
            className="w-full h-full object-contain bg-white rounded-lg shadow-sm"
          />
        </div>
        <div className="w-full h-[300px]">
          <img
            src={questiondata?.data.answerImage}
            alt="Answer Image"
            className="w-full h-full object-contain bg-white rounded-lg shadow-sm"
          />
        </div>
      </div>
    </DialogWrapper>
  );
};

export default ViewQuestion;
