import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCategoryDetails = () => {
  return (
    <div className="container">
      {" "}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <div className="md:flex">
          {/* Image Section Skeleton */}
          <div className="md:w-1/3 bg-[#fff0f0] h-64 flex items-center justify-center p-6 border-r border-orange-100">
            <div className="space-y-2 w-full flex flex-col items-center">
              <Skeleton className="h-48 w-48 rounded-xl" />
            </div>
          </div>

          {/* Content Section Skeleton */}
          <div className="p-6 md:w-2/3 space-y-6">
            {/* Title + badge + description */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Button */}
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCategoryDetails;
