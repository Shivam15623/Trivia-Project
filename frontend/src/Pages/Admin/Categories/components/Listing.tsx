import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";
import { Category } from "@/interfaces/categoriesInterface";
import { Eye } from "lucide-react";

import DeleteCategory from "./DeleteCategory";
import { usePublicToggleMutation } from "@/services";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
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
    <GradientCard
      className=""
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={4}
      radius={13.33}
    >
      <div className="flex flex-row gap-[10px] p-5">
        <img
          src={category.thumbnail}
          className="aspect-square max-w-[150px]"
          alt={category.name}
        />
        <div className="relative flex flex-1 flex-col gap-3.5 pt-2.5">
          <div className="flex flex-row items-center justify-between">
            <div className="font-michroma text-[18px] font-normal text-white">
              {category.name}
            </div>

            <div className="flex flex-col items-center justify-start gap-0.5">
              <Switch
                checked={category.isPublic}
                onCheckedChange={() => handleTogglePublic(category._id)}
                className="relative h-5 w-10 rounded-[16px] border-transparent data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-[linear-gradient(180deg,_#7BFDFD_5.07%,_#2884C7_98.61%)]"
              />
              {category.isPublic === true ? (
                <span className="text-[8px] text-white opacity-80">Public</span>
              ) : (
                <span className="text-[8px] text-white opacity-80">
                  Not Public
                </span>
              )}
            </div>
          </div>
          <p className="font-outfit text-[14px] leading-[100%] text-white">
            {category.description}
          </p>
          <div className="absolute bottom-0 right-0 flex w-fit flex-row gap-3.5">
            <Button
              onClick={() => navigate(`/admin/category/${category.slug}`)}
              className="rounded-md p-1.5"
              variant="ghost"
              size="icon"
            >
              <Eye className="text-white" />
            </Button>
            <DeleteCategory
              categoryId={category._id}
              categoryName={category.name}
            />
          </div>
        </div>
      </div>
    </GradientCard>
    // <Card
    //   key={category._id}
    //   className="group relative flex flex-col border border-orange-200 shadow-sm hover:shadow-md transition-all gap-0 py-0 duration-200 rounded-2xl overflow-hidden bg-white"
    // >
    //   {/* Thumbnail */}
    //   <div className="relative w-full h-40 bg-[#fff0f0] flex items-center justify-center border-b border-orange-100">
    //     <img
    //       src={category.thumbnail}
    //       alt={category.name}
    //       className="h-full object-contain p-4"
    //     />
    //   </div>

    //   {/* Header */}
    //   <CardHeader className="px-4 pt-4 pb-2">
    //     <div className="flex-1">
    //       <div className=" flex justify-between items-start">
    //         <CardTitle className="text-base font-semibold text-[#e34b4b] line-clamp-1">
    //           {category.name}
    //         </CardTitle>
    //         <div className="flex items-center px-3 py-1 rounded-full bg-[#ffe4e1] gap-2 text-xs text-gray-600 font-medium">
    //           <span>Public</span>
    //           <Switch
    //             checked={category.isPublic}
    //             onCheckedChange={() => handleTogglePublic(category._id)}
    //             className="scale-[0.85] data-[state=checked]:bg-[#e34b4b]"
    //           />
    //         </div>
    //       </div>

    //       {category.description && (
    //         <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
    //           {category.description}
    //         </p>
    //       )}
    //     </div>
    //   </CardHeader>

    //   {/* Footer Actions */}
    //   <CardFooter className="px-4 pb-4 pt-1 flex justify-end items-end">
    //     <div className="flex gap-2">
    //       <Button
    //         onClick={() => navigate(`/admin/category/${category.slug}`)}
    //         className="p-1.5 rounded-md "
    //         variant="ghost"
    //         size="icon"
    //       >
    //         <Eye />
    //       </Button>

    //       <CategoryDialog
    //         slug={category.slug}
    //         trigger={
    //           <Button className="p-1.5 rounded-md" variant={"ghost"}>
    //             <Edit />{" "}
    //           </Button>
    //         }
    //       />
    //       <DeleteCategory
    //         categoryId={category._id}
    //         categoryName={category.name}
    //       />
    //     </div>
    //   </CardFooter>
    // </Card>
  );
};

export default Categorylisting;
