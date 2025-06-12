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
      <Card className="relative overflow-hidden border-2 border-dashed shadow-lg bg-gradient-to-br from-[#9dcaf5] to-[#9bbfdd]">
        <div className="absolute inset-0 opacity-10 bg-[url('/dots.svg')] bg-cover z-0" />
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

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={category.data.thumbnail}
              alt={category.data.name}
              className="w-full h-64 object-contain bg-white rounded-md border border-gray-300"
            />
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
    <div className="max-w-[95%] w-[90%] mx-auto p-4 space-y-10 bg-[#fff6f0]">
      {renderCategoryDetails()}

      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Questions</h2>
        {renderQuestionsSection()}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
