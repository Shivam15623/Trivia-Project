import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteQuestionMutation } from "@/services";
import logError from "@/utills/logError";
import { showSuccess } from "@/CustomComponent/toastUtills";
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
      logError(error);
    }
  };

  return (
    <DialogWrapper
      title="Remove Question?"
      description="Are you sure you want to remove the question"
      icon={<Trash2 className="w-4 h-4" />}
      variant="destructive"
      triggerLabel=""
      type="delete"
    >
      {" "}
      <span className="font-semibold text-gray-800">{questionName}</span>?{" "}
      <br />
      This action{" "}
      <span className="text-red-500 font-semibold">cannot be undone</span>.
      <Button
        type="button"
        variant="destructive"
        onClick={handleRemove}
        className="w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Removing..." : "Remove"}
      </Button>
    </DialogWrapper>
  );
};

export default RemoveQuestionDialog;
