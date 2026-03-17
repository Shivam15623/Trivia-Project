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

const BackgroundBlobs = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="absolute left-[2%] top-[33%] h-[696px] w-[783px] rotate-[150.39deg] rounded-[132px] bg-[linear-gradient(180deg,#72FDFD99_0%,#02184299_100%)] opacity-60 blur-[100px]" />
    <div className="absolute right-[1%] top-[33%] h-[604px] w-[930px] rotate-[17.68deg] rounded-[40px] bg-[linear-gradient(180deg,#FE852099_0%,#FED55499_100%)] opacity-60 blur-[100px]" />
  </div>
);

const EmptyQuestions = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
    <LucideMessageCircleQuestion className="mb-4 h-12 w-12 text-orange-400" />
    <p className="text-lg font-semibold">No Questions Found</p>
    <p className="text-sm">This category doesn't have any questions yet.</p>
  </div>
);

const CategoryNotFound = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center text-red-500">
    <AlertTriangle className="mb-4 h-12 w-12" />
    <h2 className="text-xl font-semibold">Category Not Found</h2>
    <p className="mt-1 text-sm text-red-400">
      The category you're looking for doesn't exist or has been removed.
    </p>
  </div>
);

const CategoryDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading: categoryLoading } =
    useFetchCategorybyslugQuery(slug!, { skip: !slug });

  const { data: questionsData, isLoading: questionsLoading } =
    useFetchQuestionsbyCategoryQuery(slug!, { skip: !slug });

  const totalQuestions = useMemo(() => {
    if (!questionsData?.data) return 0;
    return Object.values(questionsData.data).reduce(
      (acc, questions) => acc + questions.length,
      0,
    );
  }, [questionsData?.data]);

  if (categoryLoading) return <SkeletonCategoryDetails />;
  if (!category) return <CategoryNotFound />;

  return (
    <>
      <div className="relative z-10 flex-1">
        <div className="container mx-auto space-y-10 p-4">
          <CategoryDetails
            category={category.data}
            totalQuestions={totalQuestions}
          />

          {questionsLoading ? (
            // Reuse your skeleton or a simpler inline spinner
            <div className="py-12 text-center text-white/60">
              Loading questions...
            </div>
          ) : questionsData?.data ? (
            <TabForQuestions questionsData={questionsData.data} />
          ) : (
            <EmptyQuestions />
          )}
        </div>
      </div>

      <BackgroundBlobs />
    </>
  );
};

export default CategoryDetailsPage;
