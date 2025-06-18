import { DialogWrapper } from "@/components/DialogWrapper";
import { showSuccess } from "@/components/toastUtills";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { Trash2 } from "lucide-react";

type Props = {
  categoryId: string;
  categoryName: string;
};
const DeleteCategory = ({ categoryId, categoryName }: Props) => {
  const [removeCategory, { isLoading }] = useDeleteCategoryMutation();

  const handleRemove = async () => {
    try {
      const response = await removeCategory(categoryId).unwrap();
      showSuccess(response.message);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <DialogWrapper
      title={`Remove Category ${categoryName}?`}
      description="Are you sure you want to remove the Category?"
      icon={<Trash2 className="w-4 h-4" />}
      variant="destructive"
      triggerLabel=""
      type="delete"
    >
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

export default DeleteCategory;
