import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteQuestionMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { DialogWrapper } from "@/components/DialogWrapper";
import { GradientButton } from "@/components/GradientButton";

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

          {/* Cancel button */}
          <DialogWrapper.CancelButton />
        </div>
      </div>
    </DialogWrapper>
  );
};

export default RemoveQuestionDialog;
