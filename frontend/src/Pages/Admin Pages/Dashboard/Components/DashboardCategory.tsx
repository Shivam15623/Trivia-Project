import { DashboardCategoryData } from "@/interfaces/categoriesInterface";

import { useNavigate } from "react-router-dom";

interface DashboardCardsProps {
  data: DashboardCategoryData;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ data }) => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Categories",
      value: data.totalCategories,
      icon: "📂",
      color: "bg-[#fff6f0]", // light pastel peach background
      textColor: "text-[#e34b4b]", // deep red text for correct answers
    },
    {
      title: "Active Categories",
      value: data.totalActiveCategories,
      icon: "✅",
      color: "bg-[#fff6f0]", // light pastel peach background
      textColor: "text-[#e34b4b]", // deep red text for correct answers
    },
    {
      title: "Inactive Categories",
      value: data.totalInactiveCategories,
      icon: "🚫",
      color: "bg-[#fff6f0]", // light pastel peach background
      textColor: "text-[#e34b4b]", // deep red text for correct answers
    },
  ];

  return (
    <div className="p-6 space-y-12">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            onClick={() => navigate("/admin/categories")}
            className={`relative rounded-xl p-6 ${stat.color} text-amber-950 transition-all transform hover:scale-105 cursor-pointer shadow-lg border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl`}
          >
            <div className="text-4xl">{stat.icon}</div>
            <div className={`mt-4 text-lg font-semibold ${stat.textColor}`}>
              {stat.title}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent hover:border-white transition-all"></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-8 w-full">
        {/* Recently Added Categories */}
        <div className="flex-1 min-w-[300px] bg-[#fff6f0] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-orange-200 hover:border-orange-300">
          <h2 className="text-2xl font-semibold mb-4 text-[#e34b4b]">
            🆕 Recently Added Categories
          </h2>
          <div className="space-y-4">
            {data.recentlyAddedCategories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center gap-4 border-b pb-2 hover:bg-orange-50 transition-all cursor-pointer"
                onClick={() => navigate(`/admin/category/${cat._id}`)}
              >
                <img
                  src={cat.thumbnail}
                  alt={cat.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="text-lg font-medium text-gray-800">
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(cat.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="flex-1 min-w-[300px] bg-[#fff6f0] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-orange-200 hover:border-orange-300">
          <h2 className="text-2xl font-semibold mb-4 text-[#e34b4b]">
            🏆 Top Categories
          </h2>
          <div className="space-y-4">
            {data.topCategories.map((cat) => (
              <div
                key={cat.categoryId}
                className="flex items-center justify-between border-b pb-2 hover:bg-orange-50 transition-all cursor-pointer"
                onClick={() => navigate(`/admin/category/${cat.categoryId}`)}
              >
                <div className="text-lg font-medium text-gray-800">
                  {cat.name}
                </div>
                <div className="text-sm text-gray-500">
                  Selected In {cat.count} Games
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Top Used Categories */}
        <div className="flex-1 min-w-[300px] bg-[#fff6f0] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-orange-200 hover:border-orange-300">
          <h2 className="text-2xl font-semibold mb-4 text-[#e34b4b]">
            📈 Monthly Top Used Categories
          </h2>
          <div className="space-y-4">
            {data.monthlyTopUsedCategories.length === 0 ? (
              <div> No Games Created This Month</div>
            ) : (
              <>
                {data.monthlyTopUsedCategories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className="flex items-center gap-4 border-b pb-2 hover:bg-orange-50 transition-all cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/category/${cat.categoryId}`)
                    }
                  >
                    <img
                      src={cat.thumbnail}
                      alt={cat.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-lg font-medium text-gray-800">
                        {cat.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        this month Selected In {cat.count} Games
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
