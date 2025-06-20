import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/interfaces/categoriesInterface";
import { Edit, Eye } from "lucide-react";

import { CategoryDialog } from "./ManageCategory";
import DeleteCategory from "./DeleteCategory";
import { usePublicToggleMutation } from "@/services";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";
type Props = {
  category: Category;
};
const Categorylisting = ({ category }: Props) => {
  const [PublicToggle] = usePublicToggleMutation();
  const navigate = useNavigate();
  const handleTogglePublic = async (id: string) => {
    try {
      const response = await PublicToggle(id).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  return (
    <Card
      key={category._id}
      className="group relative flex flex-col border border-orange-200 shadow-sm hover:shadow-md transition-all gap-0 py-0 duration-200 rounded-2xl overflow-hidden bg-white"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-40 bg-[#fff0f0] flex items-center justify-center border-b border-orange-100">
        <img
          src={category.thumbnail}
          alt={category.name}
          className="h-full object-contain p-4"
        />
      </div>

      {/* Header */}
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex-1">
          <div className=" flex justify-between items-start">
            <CardTitle className="text-base font-semibold text-[#e34b4b] line-clamp-1">
              {category.name}
            </CardTitle>
            <div className="flex items-center px-3 py-1 rounded-full bg-[#ffe4e1] gap-2 text-xs text-gray-600 font-medium">
              <span>Public</span>
              <Switch
                checked={category.isPublic}
                onCheckedChange={() => handleTogglePublic(category._id)}
                className="scale-[0.85] data-[state=checked]:bg-[#e34b4b]"
              />
            </div>
          </div>

          {category.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </CardHeader>

      {/* Footer Actions */}
      <CardFooter className="px-4 pb-4 pt-1 flex justify-end items-end">
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/admin/category/${category.slug}`)}
            className="p-1.5 rounded-md "
            variant="ghost"
            size="icon"
          >
            <Eye />
          </Button>

          <CategoryDialog
            slug={category.slug}
            trigger={
              <Button className="p-1.5 rounded-md" variant={"ghost"}>
                <Edit />{" "}
              </Button>
            }
          />
          <DeleteCategory
            categoryId={category._id}
            categoryName={category.name}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Categorylisting;
