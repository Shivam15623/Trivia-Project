import {
  useFetchCategorybyslugQuery,
  useFetchQuestionsbyCategoryQuery,
} from "@/services";
import { useParams } from "react-router-dom";
import TabForQuestions from "./components/TabForQuestions";
import { useMemo } from "react";
import CategoryDetails from "./components/Categorydetails";
import SkeletonCategoryDetails from "./components/SkelatonCategoryDetails";
import { AlertTriangle, LucideMessageCircleQuestion } from "lucide-react";
const CategoryDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } =
    useFetchCategorybyslugQuery(slug!, {
      skip: !slug,
    });
  const { data: questionsData } = useFetchQuestionsbyCategoryQuery(slug!, {
    skip: !slug,
  });
  const totalQuestions = useMemo(() => {
    if (!questionsData?.data) {
      return 0;
    }
    const temp = Object.values(questionsData.data).reduce(
      (acc, questions) => acc + questions.length,
      0
    );
    return temp;
  }, [questionsData?.data]);

  if (categoryLoading) {
    return <SkeletonCategoryDetails />;
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-red-500 border border-red-200 bg-red-50 rounded-xl">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold">Category Not Found</h2>
        <p className="text-sm text-red-400 mt-1">
          The category you’re looking for doesn’t exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fff6f0] flex-1 min-h-[100vh]">
      <div className="container mx-auto p-4 space-y-10 ">
        <CategoryDetails
          category={category.data}
          totalQuestions={totalQuestions}
        />

        {questionsData?.data ? (
          <TabForQuestions questionsData={questionsData.data} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <LucideMessageCircleQuestion className="w-12 h-12 mb-4 text-orange-400" />
            <p className="text-lg font-semibold">No Questions Found</p>
            <p className="text-sm">
              This category doesn’t have any questions yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
