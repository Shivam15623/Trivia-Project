import { Category } from "@/interfaces/categoriesInterface";
import { CategoryDialog } from "../../Categories/components/CategoryDialog";
import { Calendar, LucideMessageCircleQuestion, User } from "lucide-react";

import { QuestionDialog } from "./QuestionDialog/QuestionDialog";
import DeleteCategory from "../../Categories/components/DeleteCategory";

type Props = {
  category: Category;
  totalQuestions: number;
};
const CategoryDetails = ({ category, totalQuestions }: Props) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <div className="md:flex">
          <div className="md:w-1/3 bg-[#fff0f0] h-64 relative flex items-center justify-center p-6 border-r border-orange-100">
            <div className="absolute inset-0 mx-auto bg-[#e34b4b] opacity-5 w-2/3 rounded-full transform scale-90"></div>
            <div className="absolute inset-0 mx-auto bg-[#e34b4b] opacity-5 w-2/3 rounded-full transform scale-75 animate-pulse"></div>
            <img
              id="categoryImage"
              src={category.thumbnail}
              alt="Web Development"
              className="h-48 object-contain relative z-10"
            />
          </div>

          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h1
                    id="categoryName"
                    className="text-2xl font-bold text-gray-800"
                  >
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
                    Public
                  </span>
                </div>
                <p id="categoryDescription" className="mt-2 text-gray-600">
                  {category.description}
                </p>
              </div>

              <div className="flex space-x-2">
                <CategoryDialog
                  slug={category.slug}
                  triggerLabel=""
                  triggerclass="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                />

                <DeleteCategory
                  categoryId={category._id}
                  categoryName={category.name}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-full">
                  <LucideMessageCircleQuestion className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Questions
                  </h3>
                  <p
                    id="questionCount"
                    className="text-lg font-semibold text-gray-800"
                  >
                    {totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-full">
                  <Calendar className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p
                    id="createdAt"
                    className="text-lg font-semibold text-gray-800"
                  >
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
                <div className="p-2 bg-orange-50 rounded-full">
                  <User className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>

                  <p
                    id="statusText"
                    className="text-lg font-semibold text-gray-800"
                  >
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <QuestionDialog
                triggerLabel="Add Question"
                triggerClass="px-4 py-2 bg-[#e34b4b] text-white rounded-md hover:bg-[#d43c3c] transition-colors flex items-center"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CategoryDetails;
