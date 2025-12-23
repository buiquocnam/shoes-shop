'use client';

import { ColumnDef, Row } from "@tanstack/react-table";
import { VariantHistoryItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface VariantHistoryColumnsProps {
  productId?: string;
  variantId?: string;
}

export const createVariantHistoryColumns = ({
  productId,
  variantId,
}: VariantHistoryColumnsProps = {}): ColumnDef<VariantHistoryItem>[] => [
    {
      accessorKey: "date",
      header: "Timestamp",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const date = new Date(row.original.date);
        const formattedDate = date.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formattedDate}
          </span>
        );
      },
    },
    {
      accessorKey: "product.name",
      header: "Product Variant",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const product = row.original.product;
        const color = row.original.color;
        const size = row.original.size;
        const variant = row.original.variant;

        const canNavigate = !productId;

        const content = (
          <div className="max-w-[300px]">
            <p className="font-bold text-[#181112] dark:text-white text-base">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-medium">
                Color: {color}
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium">
                Size: {size}
              </Badge>
            </div>
          </div>
        );

        if (canNavigate && variant?.id) {
          return (
            <Link
              href={`/admin/products/history?productId=${product.id}`}
              className="hover:text-primary"
            >
              {content}
            </Link>
          );
        }

        return content;
      },
    },
    {
      accessorKey: "oldStock",
      header: "Old Stock",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const oldStock = row.original.oldStock;
        return (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {oldStock}
          </span>
        );
      },
    },
    {
      accessorKey: "variant.stock",
      header: "New Stock",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const stock = row.original.variant?.stock ?? 0;
        return (
          <span className="font-bold text-gray-900 dark:text-white ">
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "count",
      header: "Change",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const count = row.original.count;
        const isPositive = count > 0;
        return (
          <span
            className={cn(
              " gap-1 rounded-full px-2 py-1 font-bold",
              isPositive
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {count}
          </span>
        );
      },
    },
  ];

