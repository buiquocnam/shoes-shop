'use client';

import { ColumnDef, Row } from "@tanstack/react-table";
import { VariantHistoryItem } from "../services/products.api";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
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
      accessorKey: "product.name",
      header: "Sản phẩm",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const product = row.original.product;

        // Nếu chưa filter theo productId, cho phép click để filter
        const canNavigate = !productId;

        const content = (
          <div className="max-w-[300px] hover:text-primary">
            <p className="font-bold text-foreground hover:text-primary">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.brand?.name} - {product.category?.name}
            </p>
          </div>
        );

        if (canNavigate) {
          return (
            <Link
              href={`/admin/products/history?productId=${product.id}`}
              className="hover:underline "
            >
              {content}
            </Link>
          );
        }

        return content;
      },
    },
    {
      accessorKey: "color",
      header: "Màu sắc",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const color = row.original.color;
        const variant = row.original.variant;
        const product = row.original.product;

        // Cho phép click nếu:
        // 1. Chưa có productId và variantId -> filter theo cả productId và variantId
        // 2. Đã có productId nhưng chưa có variantId -> chỉ thêm variantId
        const canNavigate = variant?.id && (!productId || !variantId);

        const badge = (
          <Badge variant="secondary" className={`font-normal uppercase font-bold ${canNavigate ? 'cursor-pointer hover:bg-primary hover:text-primary-foreground' : ''}`}>
            {color}
          </Badge>
        );

        if (canNavigate) {
          // Nếu chưa có productId, lấy từ product
          const targetProductId = productId || product.id;
          return (
            <Link
              href={`/admin/products/history?productId=${targetProductId}&variantId=${variant.id}`}
              className="hover:text-primary"
            >
              {badge}
            </Link>
          );
        }

        return badge;
      },
    },
    {
      accessorKey: "size",
      header: "Kích thước",
      cell: ({ row }: { row: Row<VariantHistoryItem> }) => {
        const size = row.original.size;
        return (
          <span className="font-medium text-foreground">
            {size}
          </span>
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

