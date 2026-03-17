import { DialogWrapper } from "@/components/DialogWrapper";
import { showSuccess } from "@/components/toastUtills";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
      trigger={
        <button className="group relative flex h-[40px] w-[40px] cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#2985C8] px-[10px] font-outfit text-[18px] text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(41,133,200,0.45)]">
          <div className="pointer-events-none absolute inset-0 rounded-[10px] bg-[linear-gradient(93.58deg,#67C3FF_8.55%,#010A2A_47.56%,#67C3FF_94.76%)] p-[1px]">
            <div className="h-full w-full rounded-[10px] bg-[#2985C8]" />
          </div>
          {/* Content */}
          <span className="relative z-10">
            <Trash2 className="h-5 w-5" />
          </span>
        </button>
      }
      size="xl"
      type="delete"
    >
      <div className="">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
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

        <p className="mb-4 text-white">
          Are you sure you want to remove this category? This action cannot be
          undone and will:
        </p>

        <ul className="mb-6 space-y-2 text-white">
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
              className="mr-2 mt-0.5 text-red-500"
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
              className="mr-2 mt-0.5 text-red-500"
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
              className="mr-2 mt-0.5 text-red-500"
            >
              <path d="m5 13 4 4L19 7"></path>
            </svg>
            <span>Delete all statistics related to this category</span>
          </li>
        </ul>
      </div>

      <DialogFooter className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleRemove}
          disabled={isLoading}
          className="wrap-break-word"
        >
          {isLoading ? "Removing..." : `Yes, Delete "${categoryName}"`}
        </Button>

        {/* Cancel button */}
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
                "relative z-10 flex h-[40px] w-full items-center justify-center rounded-[20px] px-5 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",
                "bg-transparent text-white hover:bg-[#2985C866]",
              )}
            >
              Cancel
            </div>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogWrapper>
  );
};

export default DeleteCategory;
