// components/Pagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // optional icons
import { Button } from "./button";

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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <Button
        variant={"pagebutt"}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant={page === currentPage ? "gradient" : "pagebutt"}
          className={`px-3 py-1 rounded-full w-10 h-10`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant={"pagebutt"}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;
