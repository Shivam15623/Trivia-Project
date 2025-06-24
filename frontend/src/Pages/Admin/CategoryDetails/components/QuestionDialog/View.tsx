import { DialogWrapper } from "@/components/DialogWrapper";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchQuestionByIdQuery } from "@/services";
import { Eye } from "lucide-react";

const ViewQuestion = ({ questionId }: { questionId: string }) => {
  const {
    data: questiondata,
    isLoading,
    isError,
  } = useFetchQuestionByIdQuery(questionId);

  const question = questiondata?.data;

  return (
    <DialogWrapper
      title="View Question"
      description="Here you can view the details of the question."
      trigger={
        <Button
          variant="ghost"
          className="p-1.5 rounded-md text-[#ff8c42] hover:bg-[#ff8c42]/10 transition-colors"
        >
          <Eye />
        </Button>
      }
      type="info"
      size="xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">
          Failed to load question. Please try again.
        </div>
      ) : question ? (
        <>
          <div className="space-y-2">
            <div className="font-semibold text-lg">
              {question.questionText || "No question text"}
            </div>

            {question.options?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="px-3 py-1 bg-gray-100 text-gray-800"
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No options provided.
              </p>
            )}

            <div className="mt-2 font-medium text-gray-800">
              <span className="text-gray-500">Answer: </span>
              <span className="text-[#e34b4b] font-bold">
                {question.answer || "N/A"}
              </span>
            </div>

            <div className="mt-2 font-medium text-gray-800">
              <span className="text-gray-500">Points: </span>
              <span className="text-blue-600">{question.points ?? "0"}</span>
            </div>
          </div>

          {/* Images */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg shadow-sm">
              {question.questionImage ? (
                <img
                  src={question.questionImage}
                  alt="Question Image"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No question image
                </p>
              )}
            </div>

            <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg shadow-sm">
              {question.answerImage ? (
                <img
                  src={question.answerImage}
                  alt="Answer Image"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-gray-400 italic">No answer image</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-8">No data found.</div>
      )}
    </DialogWrapper>
  );
};

export default ViewQuestion;
