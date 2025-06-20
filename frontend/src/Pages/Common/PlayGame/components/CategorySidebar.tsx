import { CategoryfromSession } from "@/interfaces/GameSessionInterface";

export const CategorySidebar = ({
  categoryData,
}: {
  categoryData?: CategoryfromSession; // make optional
}) => {
  if (!categoryData) {
    return (
      <div className="hidden md:block w-full">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Category</h2>
          <div className="aspect-[1/1.28] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
            No category selected
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block w-full">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Category</h2>
        <div className="relative aspect-[1/1.28] rounded-md overflow-hidden">
          <img
            src={categoryData.thumbnail}
            alt="Category Thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-orange-500 bg-opacity-90 text-white text-center py-2">
            <span className="font-bold text-sm sm:text-base">
              {categoryData.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
