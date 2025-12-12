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
  getFilteredRowModel,
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
  // Server-side pagination 
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
  columnFilters: externalColumnFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columnFilters = externalColumnFilters ?? [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: pagination?.pageSize || 10,
        pageIndex: pagination ? pagination.currentPage - 1 : 0, // Convert to 0-based index
      },
    },
    // Server-side pagination config
    ...(pagination && {
      pageCount: pagination.totalPages,
      manualPagination: true,
    }),
  });

  return (
    <div className="space-y-4 p-1">

      <div className="rounded-lg border shadow-sm bg-gray-100">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="uppercase text-xs font-semibold text-gray-500 tracking-wider whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-1"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-500">
          {pagination ? (
            <>
              Showing {data.length} of {pagination.totalElements} results
              {pagination.totalPages > 1 && (
                <span className="ml-2">
                  (Page {pagination.currentPage} / {pagination.totalPages})
                </span>
              )}
            </>
          ) : (
            <>
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
              {table.getPageCount() > 1 && (
                <span className="ml-2">
                  (Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()})
                </span>
              )}
            </>
          )}
        </div>
        {
          pagination.totalPages > 1 && (
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
          )
        }
      </div>
    </div>
  );
}