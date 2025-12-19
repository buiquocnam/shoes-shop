"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Payment } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";

export const paymentColumns = (
  onViewDetail?: (payment: Payment) => void
): ColumnDef<Payment>[] => [
    {
      accessorKey: "product.name",
      header: "Sản phẩm",
      cell: ({ row }: { row: Row<Payment> }) => {
        const product = row.original.product;
        const imageUrl = product.imageUrl?.url || "";

        return (
          <div className="flex items-center gap-3 max-w-[300px]">
            {imageUrl && (
              <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.brand?.name} - {product.category?.name}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user.name",
      header: "Người dùng",
      cell: ({ row }: { row: Row<Payment> }) => {
        const user = row.original.user;
        return (
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "variant",
      header: "Biến thể",
      cell: ({ row }: { row: Row<Payment> }) => {
        const variant = row.original.variant;
        return (
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              {variant.color}
            </Badge>
            <Badge variant="outline" className="text-xs ml-1">
              Size: {variant.size}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Mã thanh toán",
      cell: ({ row }: { row: Row<Payment> }) => {
        return (
          <Badge variant="default" className="font-mono text-xs">
            {row.original.code}
          </Badge>
        );
      },
    },
    {
      accessorKey: "bankCode",
      header: "Ngân hàng",
      cell: ({ row }: { row: Row<Payment> }) => {
        return (
          <Badge variant="outline" className="text-xs">
            {row.original.bankCode}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Số tiền",
      cell: ({ row }: { row: Row<Payment> }) => {
        return (
          <span className="font-semibold text-primary">
            {formatCurrency(row.original.amount)}
          </span>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Ngày hết hạn",
      cell: ({ row }: { row: Row<Payment> }) => {
        const expiryDate = row.original.expiryDate;
        if (!expiryDate) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <span className="text-sm">
            {new Date(expiryDate).toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: Row<Payment> }) => {
        if (!onViewDetail) return null;

        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewDetail(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
