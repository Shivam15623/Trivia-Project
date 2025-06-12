import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { QuestionDialog } from "@/Pages/Admin Pages/Category Details/components/QuestionDialog/QuestionDialog";
import {
  useFetchCategoriesQuery,
  usePublicToggleMutation,
} from "@/services/CategoryApi";
import { useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Switch } from "@/components/ui/switch";

import logError from "@/utills/logError";
import { showSuccess } from "@/CustomComponent/toastUtills";
import { CategoryDialog } from "@/Pages/Admin Pages/Categories/components/CategoryDialog/CategoryDialog";

const Categories = () => {
  const {
    data: allCategories,
    isLoading,
    isError,
  } = useFetchCategoriesQuery(undefined);
  const [PublicToggle] = usePublicToggleMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    return allCategories?.data?.filter((category) =>
      `${category.name} `.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCategories?.data, searchQuery]);

  const handleTogglePublic = async (id: string) => {
    try {
      console.log("Toggling public status for category ID:", id);
      const response = await PublicToggle(id).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
      }
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 bg-[#fff6f0]">
      {/* Header */}
      <Card className="shadow-sm border border-orange-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-[#e34b4b]">
              All Categories
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search categories..."
                className="rounded-md px-3 py-2 w-full sm:w-64 focus-visible:ring-2 focus-visible:ring-[#e34b4b] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CategoryDialog triggerLabel="Add Category" />
              <QuestionDialog triggerLabel="Add Question" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center items-center py-8 text-[#e34b4b]">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Loading categories...
          </div>
        )}

        {isError && (
          <p className="col-span-full text-center text-red-500 font-medium">
            Failed to load categories.
          </p>
        )}

        {!isLoading && !isError && allCategories?.data?.length === 0 && (
          <p className="col-span-full text-center text-[#e34b4b]">
            No categories created yet.
          </p>
        )}

        {!isLoading && filteredCategories?.length === 0 && (
          <p className="col-span-full text-center text-[#e34b4b]">
            No categories match your search.
          </p>
        )}

        {/* Category Cards */}
        {filteredCategories?.map((category) => (
          <Card
            key={category._id}
            className="group relative flex flex-col border border-orange-200 shadow-sm hover:shadow-md transition-all gap-0 py-0 duration-200 rounded-2xl overflow-hidden bg-white"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-40 bg-[#fff0f0] flex items-center justify-center border-b border-orange-100">
              <img
                src={category.thumbnail}
                alt={category.name}
                className="h-full object-contain p-4"
              />
            </div>

            {/* Header */}
            <CardHeader className="px-4 pt-4 pb-2">
              <div className="flex-1">
                <div className=" flex justify-between items-start">
                  <CardTitle className="text-base font-semibold text-[#e34b4b] line-clamp-1">
                    {category.name}
                  </CardTitle>
                  <div className="flex items-center px-3 py-1 rounded-full bg-[#ffe4e1] gap-2 text-xs text-gray-600 font-medium">
                    <span>Public</span>
                    <Switch
                      checked={category.isPublic}
                      onCheckedChange={() => handleTogglePublic(category._id)}
                      className="scale-[0.85]"
                    />
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </CardHeader>

            {/* Footer Actions */}
            <CardFooter className="px-4 pb-4 pt-1 flex justify-end items-end">
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/admin/category/${category.slug}`)}
                  className="p-1.5 rounded-md "
                  variant="ghost"
                  size="icon"
                >
                  <Eye />
                </Button>

                <CategoryDialog slug={category.slug} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
