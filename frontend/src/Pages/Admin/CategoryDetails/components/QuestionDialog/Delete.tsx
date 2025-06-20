import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteQuestionMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { DialogWrapper } from "@/components/DialogWrapper";

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
      description="Are you sure you want to remove the question"
      trigger={
        <Button
          variant={"ghost"}
          className="p-1.5 rounded-md text-[#e34b4b] hover:bg-[#e34b4b]/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      }
      type="delete"
    >
      {" "}
      <div className="bg-[#e34b4b]/5">
        <span className="font-semibold text-gray-800">{questionName}</span>?{" "}
        <br />
        This action{" "}
        <span className="text-red-500 font-semibold">cannot be undone</span>.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleRemove}
          className="w-full "
          disabled={isLoading}
        >
          {isLoading ? "Removing..." : "Remove"}
        </Button>

        {/* Cancel button */}
        <DialogWrapper.CancelButton />
      </div>
    </DialogWrapper>
  );
};

export default RemoveQuestionDialog;
