import { Category } from "@/interfaces/categoriesInterface";
import { CategoryDialog } from "../../Categories/components/ManageCategory";
import {
  Calendar,
  Edit,
  LucideMessageCircleQuestion,
  User,
} from "lucide-react";

import { QuestionDialog } from "./QuestionDialog/Manage";
import DeleteCategory from "../../Categories/components/DeleteCategory";
import { Button } from "@/components/ui/button";

type Props = {
  category: Category;
  totalQuestions: number;
};
const CategoryDetails = ({ category, totalQuestions }: Props) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <div className="flex flex-col sm:flex-row">
          <div className="category-image-container w-full sm:w-1/3 bg-[#fff0f0] h-48 sm:h-auto relative flex items-center justify-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-orange-100">
            <div className="absolute inset-0 mx-auto bg-[#e34b4b] opacity-5 w-2/3 rounded-full transform scale-90"></div>
            <div className="absolute inset-0 mx-auto bg-[#e34b4b] opacity-5 w-2/3 rounded-full transform scale-75 animate-pulse"></div>
            <img
              src={category.thumbnail}
              alt="Web Development"
              className="h-32 sm:h-40 md:h-48 object-contain relative z-10"
            />
          </div>

          <div className="p-4 sm:p-6 w-full sm:w-2/3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {category.name}
                  </h1>
                  <span
                    id="publicBadge"
                    className={`px-2 py-0.5 ${
                      category.isPublic
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }  text-xs font-medium rounded-full`}
                  >
                    {category.isPublic ? <>Public</> : <>Not Public</>}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                  {category.description}
                </p>
              </div>

              <div className="flex space-x-2 self-end sm:self-auto">
                <CategoryDialog
                  slug={category.slug}
                  trigger={
                    <Button
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      variant={"ghost"}
                    >
                      <Edit />
                    </Button>
                  }
                />

                <DeleteCategory
                  categoryId={category._id}
                  categoryName={category.name}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-full flex-shrink-0">
                  <LucideMessageCircleQuestion className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Questions
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-full flex-shrink-0">
                  <Calendar className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                    Created
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {category.createdAt &&
                      new Date(category.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-full flex-shrink-0">
                  <User className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {category.isPublic ? <>Public</> : <>Not Public</>}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <QuestionDialog
                trigger={
                  <Button className="w-full sm:w-auto px-4 py-2 bg-[#e34b4b] text-white rounded-md hover:bg-[#d43c3c] transition-colors flex items-center justify-center gap-2">
                    Add Question
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CategoryDetails;
