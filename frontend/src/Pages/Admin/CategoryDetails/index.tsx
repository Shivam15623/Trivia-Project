import {
  useFetchCategorybyslugQuery,
  useFetchQuestionsbyCategoryQuery,
} from "@/services";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import TabForQuestions from "./components/TabForQuestions";
import { useMemo } from "react";
import CategoryDetails from "./components/Categorydetails";

const CategoryDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } =
    useFetchCategorybyslugQuery(slug!, {
      skip: !slug,
    });
  const { data: questionsData } =
    useFetchQuestionsbyCategoryQuery(slug!, {
      skip: !slug,
    });
  const toatalQuestions = useMemo(() => {
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
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (!category) {
    return (
      <div className="p-4 border border-red-300 rounded-xl text-red-500">
        Category not found.
      </div>
    );
  }

  return (
    <div className="bg-[#fff6f0] flex-1 min-h-[100vh]">
      <div className="container mx-auto p-4 space-y-10 ">
        <CategoryDetails
          category={category.data}
          totalQuestions={toatalQuestions}
        />

        {questionsData?.data ? (
          <TabForQuestions questionsData={questionsData.data} />
        ) : (
          <div className="text-red-500 font-medium">
            No questions available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
