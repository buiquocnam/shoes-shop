'use client';

import { ColumnDef, Row } from "@tanstack/react-table";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";
import { useDeleteCoupon } from "../hooks/useDeleteCoupon";

interface CreateColumnsOptions {
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
}

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const createColumns = (options?: CreateColumnsOptions): ColumnDef<Coupon>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã giảm giá" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center rounded-md bg-muted/50 px-2 py-0.5 text-xs font-bold font-mono tracking-wider border border-border/50 ${isExpired
              ? "text-muted-foreground line-through"
              : "text-primary"
              }`}
          >
            {coupon.code}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "discountPercent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giảm giá" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <span
          className={`font-bold text-base ${isExpired ? "opacity-40" : "text-foreground"}`}
        >
          {coupon.discountPercent}%
        </span>
      );
    },
  },
  {
    accessorKey: "minOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đơn tối thiểu" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <span className={`font-medium ${isExpired ? "opacity-40" : "text-muted-foreground"}`}>
          {formatCurrency(coupon.minOrder)}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng còn" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();

      return (
        <div className={`flex w-24 flex-col gap-1.5 ${isExpired ? "opacity-40" : ""}`}>
          <span>{coupon.quantity} </span>
        </div>
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hạn dùng" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.expirationDate);
      const isExpired = date < new Date();
      return (
        <div className={`flex flex-col ${isExpired ? "opacity-40" : ""}`}>
          <span className="text-sm font-medium">
            {date.toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();

      if (isExpired) {
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            Hết hạn
          </Badge>
        );
      }

      if (!coupon.active) {
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Đã tắt
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          Hoạt động
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thao tác" />
    ),
    cell: ({ row }) => {
      const coupon = row.original;
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Chỉnh sửa"
            onClick={() => options?.onEdit?.(coupon)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Sửa</span>
          </Button>
          <DeleteCouponButton coupon={coupon} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

// Delete Coupon Button Component
function DeleteCouponButton({ coupon }: { coupon: Coupon }) {
  const deleteCoupon = useDeleteCoupon();

  const handleDelete = async () => {
    try {
      await deleteCoupon.mutateAsync(coupon.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmAlert
      onConfirm={handleDelete}
      itemName={`mã giảm giá "${coupon.code}"`}
      title="Xác nhận xóa mã giảm giá"
      description={`Bạn có chắc chắn muốn xóa mã giảm giá "${coupon.code}"? Hành động này không thể hoàn tác.`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title="Xóa"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </ConfirmAlert>
  );
}

// Default export for backward compatibility
export const columns = createColumns();

