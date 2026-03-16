import { DialogWrapper } from "@/components/DialogWrapper";
import Loader from "@/components/Loader";

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
      trigger={
        <Button className="text-white" variant={"link"}>
          {" "}
          <Eye className="h-6 w-6" />
        </Button>
      }
      type="info"
      size="3xl"
    >
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500">
          Failed to load question. Please try again.
        </div>
      ) : question ? (
        <>
          <div className="space-y-3.5 font-outfit font-normal leading-[100%] text-white">
            <div className="font-outfit text-2xl font-normal leading-[100%] text-white">
              {question.questionText || "No question text"}
            </div>

            {question.options?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-full px-[18px] py-3 font-medium text-white"
                  >
                    <span className="relative z-10 text-sm"> {option}</span>

                    <div className="absolute inset-0 rounded-full border border-white/30 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">
                No options provided.
              </p>
            )}

            <div className="flex flex-row items-center gap-3.5">
              <span className="text-lg">Answer: </span>
              <span className="font-bold text-[#e34b4b]">
                <div className="relative overflow-hidden rounded-full px-[18px] py-3 font-medium text-white">
                  <span className="relative z-10 text-sm">
                    {" "}
                    {question.answer || "N/A"}
                  </span>

                  <div className="absolute inset-0 rounded-full border border-white/30 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl" />
                </div>
              </span>
            </div>

            <div className="flex flex-row gap-3.5">
              <span className="text-lg">Points: </span>
              <span className="text-lg">{question.points ?? "0"}</span>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 font-outfit font-normal leading-[100%] text-white sm:max-w-[60%] sm:grid-cols-2">
              <div className="flex flex-col gap-3.5">
                <p className="text-lg">Question Image</p>
                <img
                  src={question.questionImage}
                  alt="Question Image"
                  className="h-full max-h-[120px] max-w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-3.5">
                <p className="text-lg">Answer Image</p>
                <img
                  src={question.answerImage}
                  alt="Answer Image"
                  className="max-h-[120px] max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Images */}

          {/* <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white shadow-sm">
              {question.questionImage ? (
                <img
                  src={question.questionImage}
                  alt="Question Image"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm italic text-gray-400">
                  No question image
                </p>
              )}
            </div>

            <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-white shadow-sm">
              {question.answerImage ? (
                <img
                  src={question.answerImage}
                  alt="Answer Image"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm italic text-gray-400">No answer image</p>
              )}
            </div>
          </div> */}
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">No data found.</div>
      )}
    </DialogWrapper>
  );
};

export default ViewQuestion;
