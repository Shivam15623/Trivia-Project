import {
  useFetchCategorybyslugQuery,
  useFetchQuestionsbyCategoryQuery,
} from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import TabForQuestions from "./components/TabForQuestions";
import { CategoryDialog } from "../Categories/components/CategoryDialog";
import { QuestionDialog } from "./components/QuestionDialog/QuestionDialog";

const CategoryDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } =
    useFetchCategorybyslugQuery(slug!, {
      skip: !slug,
    });
  const { data: questionsData, isLoading: questionsLoading } =
    useFetchQuestionsbyCategoryQuery(slug!, {
      skip: !slug,
    });

  if (categoryLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (!category) {
    return (
      <div className="p-4 border border-red-300 rounded-xl text-red-500">
        Category not found.
      </div>
    );
  }

  const renderCategoryDetails = () => {
    return (
      <Card className="relative overflow-hidden border-2 border-dashed shadow-lg bg-gradient-to-br from-[#9dcaf5] to-[#9bbfdd] rounded-xl">
        {/* <div className="absolute inset-0 opacity-10 dots-pattern z-0"></div> */}
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">
              {category.data.name}
            </CardTitle>
          </div>
          <CardDescription className="mt-1  text-gray-600">
            {category.data.description || "No description provided."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={category.data.thumbnail}
              alt={category.data.name}
              className="w-full h-64 object-contain bg-white rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="bg-white/80 rounded-md p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Category Details
              </h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium text-gray-600">
                  Created:
                </div>
                <div className="text-sm text-gray-800">
                  {category.data.createdAt &&
                    new Date(category.data.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                </div>

                <div className="text-sm font-medium text-gray-600">
                  Questions:
                </div>
                <div className="text-sm text-gray-800">
                  {questionsLoading
                    ? "Loading..."
                    : questionsData?.data
                    ? Object.values(questionsData.data).reduce(
                        (acc, questions) => acc + questions.length,
                        0
                      )
                    : "0"}
                </div>

                <div className="text-sm font-medium text-gray-600">Status:</div>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      category.data.isPublic ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-sm text-gray-800">
                    {category.data.isPublic ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <CategoryDialog
                slug={slug}
                triggerLabel="Edit Dialog"
                triggerclass="flex-1 bg-[#a90000] hover:bg-[#8a0000] hover:text-white text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              />
              <QuestionDialog
                triggerLabel="Add Question"
                triggerClass="flex-1 bg-[#e34b4b] hover:bg-[#d13e3e] hover:text-white text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQuestionsSection = () => {
    if (questionsLoading) {
      return <Skeleton className="h-24 w-full rounded-md bg-gray-200" />;
    }

    return questionsData?.data ? (
      <TabForQuestions questionsData={questionsData.data} />
    ) : (
      <div className="text-red-500 font-medium">No questions available.</div>
    );
  };

  return (
    <div className="bg-[#fff6f0]">
      <div className="container mx-auto p-4 space-y-10 ">
        {renderCategoryDetails()}

        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Questions
          </h2>
          {renderQuestionsSection()}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
