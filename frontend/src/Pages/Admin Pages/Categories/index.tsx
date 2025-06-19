import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { QuestionDialog } from "@/Pages/Admin Pages/Category Details/components/QuestionDialog/QuestionDialog";
import { useFetchCategoriesQuery } from "@/services/CategoryApi";
import { useEffect, useMemo, useState } from "react";


import { CategoryDialog } from "@/Pages/Admin Pages/Categories/components/CategoryDialog";

import Categorylisting from "./components/Categorylisting";
import Pagination from "@/components/ui/paggination";
import { usePagination } from "@/hooks/usePagination";

const Categories = () => {
  const {
    data: allCategories,
    isLoading,
    isError,
  } = useFetchCategoriesQuery(undefined);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return allCategories?.data?.filter((category) =>
      `${category.name} `.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCategories?.data, searchQuery]);
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCategories,
    setPage,
  } = usePagination(filteredCategories || [], 5);
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filteredCategories?.length]);
  return (
    <div className="space-y-6 px-4 md:px-8 py-6 ">
      {/* Header */}
      <Card className="bg-white rounded-xl shadow-sm border border-orange-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-[#e34b4b]">
              All Categories
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search categories..."
                className="rounded-md px-3 py-2 w-full sm:w-64 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e34b4b] focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CategoryDialog
                trigger={
                  <Button className="px-4 py-2 bg-[#a90000] hover:text-white text-white rounded-md hover:bg-[#8a0000] transition-colors">
                    Add Category
                  </Button>
                }
              />
              <QuestionDialog
                trigger={
                  <Button className="px-4 py-2 bg-[#e34b4b] text-white hover:text-white rounded-md hover:bg-[#d13e3e] transition-colors flex items-center gap-2">
                    Add Question
                  </Button>
                }
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {isLoading && (
          <div className="col-span-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-6">
           
            <div className="absolute inset-0 border-4 border-cream rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-light-red border-r-light-orange border-transparent rounded-full animate-spin"></div>
            
           
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-tab-from" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-light-red mb-2">Loading Categories</h3>
          <p className="text-orange text-center max-w-xs">We're preparing an amazing selection of categories for you</p>
          
        
          <div className="w-full max-w-xs mt-6 bg-cream rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-light-red to-light-orange shimmer"></div>
          </div>
        </div>
      </div>
          
        )}

        {isError && allCategories?.data?.length === 0 && (
          <div className="col-span-full mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-light-red/20">
          <div className="bg-light-red/10 p-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-deep-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-deep-red mb-2">No Categories Found</h3>
            <p className="text-footer mb-6">We couldn't find any categories in our database.</p>
            
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-cream text-orange rounded-md hover:bg-cream/70 transition-colors">
                Go Back
              </button>
              <button className="px-4 py-2 bg-tab-gradient text-white rounded-md hover:opacity-90 transition-opacity">
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
        )}

        {!isLoading && filteredCategories?.length === 0 && (
         <div className="col-span-full mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <div className="flex flex-col items-center">
           
            <div className="w-32 h-32 mb-6 relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-light-orange opacity-20">
                <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-light-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-light-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-light-red mb-2">No Matching Categories</h3>
            <p className="text-orange text-center max-w-md mb-6">We couldn't find any categories that match your search criteria. Try adjusting your search terms.</p>
            
            
          </div>
        </div>
      </div>
        )}

        {/* Category Cards */}
        {paginatedCategories?.map((category) => (
          <Categorylisting category={category} />
        ))}
      </div>
      {filteredCategories && filteredCategories?.length > 4 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default Categories;
