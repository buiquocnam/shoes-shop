"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };

  onPageChange?: (page: number) => void;
  onRowClick?: (row: TData) => void;
  columnFilters?: ColumnFiltersState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,

    // ✅ core only
    getCoreRowModel: getCoreRowModel(),

    // sorting (nếu backend chưa sort thì bỏ)
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // ✅ server-side states
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.currentPage - 1, // 0-based
        pageSize: pagination.pageSize,
      },
    },

    manualPagination: true,
    pageCount: pagination.totalPages,

    // ❌ KHÔNG dùng
    // getFilteredRowModel
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b border-border/50 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((_, rowIndex) => {
                const row = table.getRowModel().rows[rowIndex];
                return (
                  <TableRow
                    key={row.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{data.length}</span> of{" "}
          <span className="font-medium text-foreground">{pagination.totalElements}</span> results
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page <span className="font-medium text-foreground">{pagination.currentPage}</span> /{" "}
              <span className="font-medium text-foreground">{pagination.totalPages}</span>)
            </span>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {pagination.currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(pagination.currentPage - 1);
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}

              {(() => {
                const pages: (number | 'ellipsis')[] = [];
                const maxVisible = 5;

                if (pagination.totalPages <= maxVisible) {
                  for (let i = 1; i <= pagination.totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  if (pagination.currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                      pages.push(i);
                    }
                    pages.push('ellipsis');
                    pages.push(pagination.totalPages);
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pages.push(1);
                    pages.push('ellipsis');
                    for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    pages.push(1);
                    pages.push('ellipsis');
                    for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
                      pages.push(i);
                    }
                    pages.push('ellipsis');
                    pages.push(pagination.totalPages);
                  }
                }

                return pages.map((page, index) => {
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
                          onPageChange?.(page);
                        }}
                        isActive={page === pagination.currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              {pagination.currentPage < pagination.totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(pagination.currentPage + 1);
                    }}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
