import { SpringBootPagination } from "@/domain/domain";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps<T> {
  pagination: SpringBootPagination<T>;
  onPageChange: (page: number) => void;
}

export function SimplePagination<T>({
  pagination,
  onPageChange,
}: SimplePaginationProps<T>) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  return (
    <div className="glass-panel flex items-center gap-3 rounded-full px-3 py-2 text-white/80">
      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer rounded-full text-white/80 hover:bg-white/10 hover:text-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={pagination.first}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      <div className="min-w-32 text-center text-sm font-medium tracking-wide">
        Page {currentPage + 1} of {totalPages}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer rounded-full text-white/80 hover:bg-white/10 hover:text-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={pagination.last}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
