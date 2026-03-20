import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { QuestionDialog } from "@/Pages/Admin/CategoryDetails/components/QuestionDialog/Manage";
import { useFetchCategoriesQuery } from "@/services/CategoryApi";
import { useEffect, useMemo, useState } from "react";

import { CategoryDialog } from "@/Pages/Admin/Categories/components/ManageCategory";

import Categorylisting from "./components/Listing";
import Pagination from "@/components/ui/paggination";
import { usePagination } from "@/hooks/usePagination";
import { AlertTriangle, Search } from "lucide-react";
import { GradientButton } from "@/components/GradientButton";
import { cn } from "@/lib/utils";

const Categories = () => {
  const {
    data: allCategories,
    isLoading,
    isError,
  } = useFetchCategoriesQuery(undefined);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return allCategories?.data?.filter((category) =>
      `${category.name} `.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allCategories?.data, searchQuery]);
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCategories,
    setPage,
  } = usePagination(filteredCategories || [], 10);
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filteredCategories?.length]);
  return (
    <>
      {/* Header */}

      <div className="relative z-10 flex w-full flex-col items-start justify-between gap-3 overflow-visible sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full max-w-[400px]">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[44px] w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 pr-11 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-white/50" />
        </div>

        <div className="flex flex-wrap gap-3 sm:flex-row sm:gap-[18px]">
          <CategoryDialog
            trigger={
              <GradientButton
                className="w-full max-w-full sm:max-w-none  min-w-fit sm:w-auto"
                icon={false}
              >
                Add Category
              </GradientButton>
            }
          />

          <QuestionDialog
            trigger={
              <Button
                className={cn(
                  "gradient-border h-[40px] w-full cursor-pointer p-0 transition-all duration-200 sm:w-auto",
                )}
                style={
                  {
                    "--border-gradient":
                      "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                    "--radius": "20px",
                    "--padding": "1px",
                  } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    "relative z-10 flex h-[40px] w-full items-center justify-center rounded-[20px] px-5 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",
                    "bg-transparent text-white hover:bg-[#2985C866]",
                  )}
                >
                  Add Question
                </div>
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        {/* Loading */}
        {isLoading && (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 p-8">
              <div className="relative mb-6 h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#7BFDFD]" />
              </div>
              <h3 className="text-base font-semibold text-white/70">
                Loading categories…
              </h3>
            </div>
          </div>
        )}

        {/* Error / empty */}
        {(isError || allCategories?.data?.length === 0) && (
          <div className="col-span-full mt-4">
            <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <AlertTriangle className="mb-3 h-8 w-8 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">
                No Categories Found
              </h3>
              <p className="mt-1 text-sm text-white/50">
                We couldn't find any categories in the database.
              </p>
            </div>
          </div>
        )}

        {/* No search results */}
        {!isLoading && filteredCategories?.length === 0 && (
          <div className="col-span-full mt-4">
            <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3 h-8 w-8 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-bold text-white/70">
                No Matching Categories
              </h3>
              <p className="mt-1 max-w-sm text-sm text-white/40">
                Try adjusting your search terms.
              </p>
            </div>
          </div>
        )}

        {/* Cards */}
        {paginatedCategories?.map((category) => (
          <Categorylisting key={category._id} category={category} />
        ))}
      </div>
      {/* <div className="flex h-[44px] w-[403px] items-center justify-center rounded-[52px] relative after: bg-white/10 text-sm font-medium tracking-wide text-white/90 shadow-[inset_0.5px_0.6px_1px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md backdrop-saturate-150">
        Glass Effect
      </div> */}
      {filteredCategories && filteredCategories?.length > 10 && (
        <div className="relative z-10 mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[2%] top-[10%] h-[696px] w-[783px] rotate-[150.39deg] rounded-[132px] bg-[linear-gradient(180deg,#72FDFD99_0%,#02184299_100%)] opacity-60 blur-[100px]" />
        <div className="absolute right-[4.5%] top-[11%] h-[604px] w-[930px] rotate-[17.68deg] rounded-[40px] bg-[linear-gradient(180deg,#FE852099_0%,#FED55499_100%)] opacity-60 blur-[100px]" />
      </div>
    </>
  );
};

export default Categories;
