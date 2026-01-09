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

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const createVariantHistoryColumns = ({
  productId,
  variantId,
}: VariantHistoryColumnsProps = {}): ColumnDef<VariantHistoryItem>[] => [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thời gian" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const formattedDate = date.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <span className="text-muted-foreground whitespace-nowrap text-xs font-mono">
            {formattedDate}
          </span>
        );
      },
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sản phẩm & Biến thể" />
      ),
      cell: ({ row }) => {
        const product = row.original.product;
        const color = row.original.color;
        const size = row.original.size;
        const variant = row.original.variant;

        const canNavigate = !productId;

        const content = (
          <div className="max-w-[300px] py-1">
            <p className="font-semibold text-foreground text-sm line-clamp-1">{product.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-[10px] font-bold h-5 uppercase px-1.5">
                {color}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold h-5 uppercase px-1.5">
                Size {size}
              </Badge>
            </div>
          </div>
        );

        if (canNavigate && variant?.id) {
          return (
            <Link
              href={`/admin/products/history?productId=${product.id}`}
              className="hover:text-primary transition-colors"
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trước" />
      ),
      cell: ({ row }) => {
        const oldStock = row.original.oldStock;
        return (
          <span className="font-medium text-muted-foreground">
            {oldStock}
          </span>
        );
      },
    },
    {
      accessorKey: "variant.stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sau" />
      ),
      cell: ({ row }) => {
        const stock = row.original.variant?.stock ?? 0;
        return (
          <span className="font-bold text-foreground">
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thay đổi" />
      ),
      cell: ({ row }) => {
        const count = row.original.count;
        const isPositive = count > 0;
        return (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset",
              isPositive
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : "bg-red-50 text-red-700 ring-red-600/20"
            )}
          >
            {isPositive ? "+" : ""}
            {count}
          </div>
        );
      },
    },
  ];

