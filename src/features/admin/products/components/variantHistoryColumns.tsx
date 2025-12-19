'use client';

import { ColumnDef, Row } from "@tanstack/react-table";
import { VariantHistoryItem } from "../services/products.api";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export const variantHistoryColumns: ColumnDef<VariantHistoryItem>[] = [
  {
    accessorKey: "product.name",
    header: "Sản phẩm",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const product = row.original.product;
      return (
        <div className="max-w-[300px]">
          <p className="font-medium text-foreground">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            {product.brand?.name} - {product.category?.name}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Màu sắc",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const color = row.original.color;
      return (
        <Badge variant="secondary" className={`font-normal uppercase font-bold`}>
          {color}
        </Badge>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Kích thước",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const size = row.original.size;
      return (
        <span className="font-medium text-foreground">{size}</span>
      );
    },
  },
  {
    accessorKey: "count",
    header: "Số lượng thay đổi",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const count = row.original.count;
      const isPositive = count > 0;
      return (
        <span
          className={cn(
            "font-semibold",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}
          {count}
        </span>
      );
    },
  },
  {
    accessorKey: "variant.stock",
    header: "Tồn kho hiện tại",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const stock = row.original.variant?.stock ?? 0;
      return (
        <span
          className={cn(
            "font-medium",
            stock === 0
              ? "text-destructive"
              : stock < 10
                ? "text-orange-600"
                : "text-foreground"
          )}
        >
          {stock}
        </span>
      );
    },
  },
  {
    accessorKey: "product.price",
    header: "Giá",
    cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
      const price = row.original.product.price;
      return (
        <span className="font-semibold text-foreground">
          {formatCurrency(price)}
        </span>
      );
    },
  },
];

