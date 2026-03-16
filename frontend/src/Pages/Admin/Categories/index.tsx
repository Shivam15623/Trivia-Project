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

        <div className="flex flex-row gap-[18px] overflow-visible">
          {" "}
          <CategoryDialog
            trigger={
              <GradientButton className="min-w-fit" icon={false}>
                Add Category
              </GradientButton>
            }
          />
          <QuestionDialog
            trigger={
              <Button
                className={cn(
                  "gradient-border h-[40px] cursor-pointer p-0 transition-all duration-200",
                )}
                style={
                  {
                    "--border-gradient":
                      "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                    "--radius": `20px`,
                    "--padding": `1px`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    "relative z-10 flex h-[40px] items-center justify-center rounded-[20px] px-5 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",
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
      <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white p-8 shadow-lg">
              <div className="relative mb-6 h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-[#fff0e5]"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-[#ffc070] border-t-[#e34b4b]"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-tab-from h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    ></path>
                  </svg>
                </div>
              </div>

              <h3 className="mb-2 text-xl font-bold text-[#e34b4b]">
                Loading Categories
              </h3>
            </div>
          </div>
        )}

        {(isError || allCategories?.data?.length === 0) && (
          <div className="col-span-full mt-8">
            <div className="overflow-hidden rounded-xl border border-[#e34b4b]/20 bg-white shadow-lg">
              <div className="flex items-center justify-center bg-[#e34b4b]/10 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <AlertTriangle className="h-8 w-8 text-[#a90000]" />
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="mb-2 text-xl font-bold text-[#a90000]">
                  No Categories Found
                </h3>
                <p className="text-footer mb-6">
                  We couldn't find any categories in our database.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && filteredCategories?.length === 0 && (
          <div className="col-span-full mt-8">
            <div className="overflow-hidden rounded-xl bg-white p-8 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="relative mb-6 h-32 w-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-full w-full text-[#ffc070] opacity-20"
                  >
                    <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-[#e34b4b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="absolute right-1/4 top-1/4 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#e34b4b] bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e34b4b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-[#e34b4b]">
                  No Matching Categories
                </h3>
                <p className="mb-6 max-w-md text-center text-[#ff8c42]">
                  We couldn't find any categories that match your search
                  criteria. Try adjusting your search terms.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Cards */}
        {paginatedCategories?.map((category) => (
          <Categorylisting category={category} />
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
