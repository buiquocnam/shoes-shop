"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { PaymentRecord } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";

export const paymentColumns = (
  onViewDetail?: (payment: PaymentRecord) => void
): ColumnDef<PaymentRecord>[] => [
    {
      accessorKey: "paymentId",
      header: "Mã GD",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="font-mono text-[10px] w-fit">
              {row.original.paymentId.slice(-8).toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {row.original.response?.createdDate
                ? new Date(row.original.response.createdDate).toLocaleDateString("vi-VN")
                : "---"}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        const isSuccess = !!row.original.response;
        return (
          <Badge variant={isSuccess ? "default" : "destructive"} className={isSuccess ? "bg-success hover:bg-success/90" : ""}>
            {isSuccess ? "Thành công" : "Thất bại"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "user.name",
      header: "Khách hàng",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "products",
      header: "Sản phẩm",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        const response = row.original.response;
        if (!response || !response.items.length) {
          if (!response) return <span className="text-muted-foreground text-xs font-italic">Không có dữ liệu</span>
          return <span className="text-muted-foreground text-xs">0 sản phẩm</span>;
        }

        const firstItem = response.items[0];
        const otherCount = response.items.length - 1;
        const imageUrl = firstItem.product.imageUrl?.url;

        return (
          <div className="flex items-center gap-3 min-w-[250px] max-w-[350px]">
            <div className="relative h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-border">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={firstItem.product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground/50">IMG</div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate py-0.5" >
                {firstItem.product.name}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Badge variant="secondary" className="px-1 py-0 text-[10px] h-5 font-normal">
                  {firstItem.variant.color}
                </Badge>
                <span className="text-[10px]">Size {firstItem.variant.size}</span>
                {otherCount > 0 && (
                  <Badge variant="outline" className="ml-auto px-1 py-0 text-[10px] h-5 bg-primary/5 text-primary border-primary/20">
                    +{otherCount} khác
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "amount",
      header: "Tổng thanh toán",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        const response = row.original.response;
        if (!response) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col items-end">
            <span className="font-bold text-primary text-sm">
              {formatCurrency(response.finishPrice)}
            </span>
            {(response.discountPercent || 0) > 0 && (
              <span className="text-[10px] text-success bg-success/10 px-1 rounded">
                -{response.discountPercent}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: Row<PaymentRecord> }) => {
        if (!onViewDetail || !row.original.response) return (
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 cursor-not-allowed" disabled>
            <Eye className="h-4 w-4" />
          </Button>
        );

        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onViewDetail(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
