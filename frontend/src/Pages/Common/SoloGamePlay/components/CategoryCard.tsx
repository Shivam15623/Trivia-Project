import { CategoryfromSession } from "@/interfaces/GameSessionInterface";

const CategoryCard = ({
  categoryData,
}: {
  categoryData?: CategoryfromSession;
}) => {
  if (!categoryData) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 p-6 text-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center">
      <div className="flex items-center">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={categoryData.thumbnail}
            alt={`${categoryData.name} thumbnail`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-4 py-3 flex-grow">
          <h2 className="font-bold text-gray-800"> {categoryData.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
