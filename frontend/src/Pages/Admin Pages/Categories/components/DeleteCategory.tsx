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
      trigger={
        <Button variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      }
      size="xl"
      type="delete"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleRemove}
          disabled={isLoading}
          className=" wrap-break-word"
          
        >
          {isLoading ? "Removing..." : `Yes, Delete "${categoryName}"`}
        </Button>

        {/* Cancel button */}
        <DialogWrapper.CancelButton />
      </div>
    </DialogWrapper>
  );
};

export default DeleteCategory;
