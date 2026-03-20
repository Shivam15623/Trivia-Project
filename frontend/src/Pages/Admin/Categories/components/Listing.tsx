import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/interfaces/categoriesInterface";
import { Edit, Eye } from "lucide-react";
import DeleteCategory from "./DeleteCategory";
import { usePublicToggleMutation } from "@/services";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { CategoryDialog } from "./ManageCategory";

type Props = { category: Category };

const Categorylisting = ({ category }: Props) => {
  const [PublicToggle] = usePublicToggleMutation();
  const navigate = useNavigate();

  const handleTogglePublic = async (id: string) => {
    try {
      const response = await PublicToggle(id).unwrap();
      if (response.success) showSuccess(response.message);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <GradientCard
      className="w-full"
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={4}
      radius={13.33}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-3 sm:p-5">
        {/* Thumbnail */}
        <div className="flex justify-center sm:block">
          <img
            src={category.thumbnail}
            className="h-[100px] w-[100px] flex-shrink-0 object-contain sm:h-[120px] sm:w-[120px] lg:h-[150px] lg:w-[150px]"
            alt={category.name}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Top row — name + toggle */}
          <div className="flex flex-row items-start justify-between gap-2">
            <h3 className="font-michroma text-[15px] font-normal leading-snug text-white sm:text-[16px] lg:text-[18px]">
              {category.name}
            </h3>

            <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
              <Switch
                checked={category.isPublic}
                onCheckedChange={() => handleTogglePublic(category._id)}
                className="h-5 w-10 rounded-[16px] border-transparent data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-[linear-gradient(180deg,_#7BFDFD_5.07%,_#2884C7_98.61%)]"
              />
              <span className="text-[8px] text-white opacity-80">
                {category.isPublic ? "Public" : "Not Public"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 font-outfit text-[13px] leading-relaxed text-white/80 sm:text-[14px]">
            {category.description}
          </p>

          {/* Actions — in flow, not absolute */}
          <div className="mt-auto flex flex-row items-center gap-1 pt-1">
            <Button
              onClick={() => navigate(`/admin/category/${category.slug}`)}
              className="rounded-md p-0.5 hover:bg-[#f5f5f52b]"
              variant="ghost"
              size="icon"
            >
              <Eye className="text-white" size={20} />
            </Button>

            <CategoryDialog
              slug={category.slug}
              trigger={
                <Button
                  className="rounded-md p-0.5 hover:bg-[#f5f5f52b]"
                  variant="ghost"
                  size="icon"
                >
                  <Edit className="text-white" size={20} />
                </Button>
              }
            />

            <DeleteCategory
              categoryId={category._id}
              categoryName={category.name}
            />
          </div>
        </div>
      </div>
    </GradientCard>
  );
};

export default Categorylisting;
