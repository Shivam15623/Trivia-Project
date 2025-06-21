import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const PaginationVariants = {
  default: {
    active: "gradient",
    normal: "pagebutt",
  },
  MyGames: {
    active: "brownPageButtonActive",
    normal: "brownPage",
  },
} as const;

// This creates a strict union of only valid keys
type PageVariants = keyof typeof PaginationVariants;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  variant: PageVariants;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  variant,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pvariant = PaginationVariants[variant];

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant={pvariant.normal}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-full w-10 h-10"
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant={page === currentPage ? pvariant.active : pvariant.normal}
          className="px-3 py-1 rounded-full w-10 h-10"
        >
          {page}
        </Button>
      ))}

      <Button
        variant={pvariant.normal}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-full w-10 h-10"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;
