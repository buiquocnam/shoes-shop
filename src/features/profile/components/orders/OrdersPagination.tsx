'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from '@/utils/pagination';

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  currentItemsCount: number;
  onPageChange: (page: number) => void;
}

export function OrdersPagination({
  currentPage,
  totalPages,
  totalElements,
  currentItemsCount,
  onPageChange,
}: OrdersPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 border-t border-border">
      <div className="text-sm text-muted-foreground">
        Hiển thị <span className="font-medium text-foreground">{currentItemsCount}</span> trong{' '}
        <span className="font-medium text-foreground">{totalElements}</span> đơn hàng
        <span className="ml-2">
          (Trang <span className="font-medium text-foreground">{currentPage}</span> /{' '}
          <span className="font-medium text-foreground">{totalPages}</span>)
        </span>
      </div>

      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage - 1);
                }}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {getPageNumbers(currentPage, totalPages).map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage + 1);
                }}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}


