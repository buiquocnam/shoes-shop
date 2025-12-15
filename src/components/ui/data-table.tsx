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
import { Button } from "@/components/ui/button";

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

  columnFilters?: ColumnFiltersState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
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
    <div className="space-y-4 p-1">
      <div className="rounded-lg border bg-gray-100 shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-primary"
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
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1">
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
                  className="h-24 text-center text-gray-500"
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
        <div className="text-sm text-gray-500">
          Showing {data.length} of {pagination.totalElements} results
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page {pagination.currentPage} / {pagination.totalPages})
            </span>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
