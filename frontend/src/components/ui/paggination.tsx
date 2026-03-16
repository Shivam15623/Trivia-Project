import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    const siblingCount = 1; // pages beside current
    const left = Math.max(2, currentPage - siblingCount);
    const right = Math.min(totalPages - 1, currentPage + siblingCount);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-[5px]">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-1 py-2.5 font-outfit text-[13px] font-semibold",
          "text-white/80 transition-colors duration-200",
          "hover:text-white",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        Prev
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2 text-white">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={cn(
              "gradient-border h-8 shadow-[0px_0px_34px_0px_#F5FFE633] transition-colors duration-200",
              page !== currentPage &&
                "hover:bg-[linear-gradient(180deg,_#7BFDFD_9.21%,_#2884C7_90.46%)]",
              page === currentPage &&
                "bg-[linear-gradient(180deg,_#7BFDFD_9.21%,_#2884C7_90.46%)]",
            )}
            style={
              {
                "--border-gradient":
                  "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                "--radius": "8px",
                "--padding": "1px",
              } as React.CSSProperties
            }
          >
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-[8px] font-outfit text-[13px] text-white transition-colors duration-200",
                page !== currentPage &&
                  "hover:bg-[linear-gradient(180deg,_#7BFDFD_9.21%,_#2884C7_90.46%)]",
                page === currentPage &&
                  "bg-[linear-gradient(180deg,_#7BFDFD_9.21%,_#2884C7_90.46%)]",
              )}
            >
              {page}
            </div>
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-1 py-2.5 font-outfit text-[13px] font-semibold",
          "text-white/80 transition-colors duration-200",
          "hover:text-white",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
