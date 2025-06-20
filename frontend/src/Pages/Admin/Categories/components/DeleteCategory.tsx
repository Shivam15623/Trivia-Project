import { DialogWrapper } from "@/components/DialogWrapper";
import { showSuccess } from "@/components/toastUtills";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
      <div className="p-4 bg-[#e34b4b]/5">
        <div className="flex  items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-red-600"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Are you sure you want to remove this category? This action cannot be
          undone and will:
        </p>

        <ul className="space-y-2 mb-6 text-gray-600">
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-red-500 mr-2 mt-0.5"
            >
              <path d="m5 13 4 4L19 7"></path>
            </svg>
            <span>Remove all questions associated with this category</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-red-500 mr-2 mt-0.5"
            >
              <path d="m5 13 4 4L19 7"></path>
            </svg>
            <span>Remove this category from all games that use it</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-red-500 mr-2 mt-0.5"
            >
              <path d="m5 13 4 4L19 7"></path>
            </svg>
            <span>Delete all statistics related to this category</span>
          </li>
        </ul>
      </div>

      <DialogFooter className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
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
      </DialogFooter>
    </DialogWrapper>
  );
};

export default DeleteCategory;
