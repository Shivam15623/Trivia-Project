import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteQuestionMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { DialogWrapper } from "@/components/DialogWrapper";
import { GradientButton } from "@/components/GradientButton";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

interface RemoveQuestionDialogProps {
  questionId: string;
  questionName: string;
}

const RemoveQuestionDialog = ({
  questionId,
  questionName,
}: RemoveQuestionDialogProps) => {
  const [removeQuestion, { isLoading }] = useDeleteQuestionMutation();

  const handleRemove = async () => {
    try {
      const response = await removeQuestion(questionId).unwrap();
      showSuccess(response.message);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <DialogWrapper
      title="Remove Question?"
      size="lg"
      trigger={
        <Button className="text-white" variant={"link"}>
          <Trash2 className="h-6 w-6" />
        </Button>
      }
      type="delete"
    >
      <div className="flex flex-col gap-[14px] font-outfit text-[24px] font-normal leading-[100%] text-white">
        <p>{questionName}</p>
        <p className="text-lg font-normal">
          This action
          <span className="text-red-500">cannot be undone</span>.
        </p>
        <div className="flex flex-row gap-[18px]">
          <GradientButton
            type="button"
            onClick={handleRemove}
            className="h-10 bg-[#DD0000] px-10 font-outfit hover:bg-[#B80000]"
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </GradientButton>
        
          <DialogClose asChild>
            <Button
              className={cn(
                "gradient-border h-[40px] cursor-pointer p-0 transition-all duration-200",
              )}
              style={
                {
                  "--border-gradient":
                    "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                  "--radius": `20px`,
                  "--padding": `1px`,
                } as React.CSSProperties
              }
            >
              <div
                className={cn(
                  "relative z-10 flex h-[40px] items-center justify-center rounded-[20px] px-5 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",
                  "bg-transparent text-white hover:bg-[#2985C866]",
                )}
              >
                Cancel
              </div>
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default RemoveQuestionDialog;
