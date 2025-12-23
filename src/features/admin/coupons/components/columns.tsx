'use client';

import { ColumnDef, Row } from "@tanstack/react-table";
import { Coupon } from "../types";
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

export const createColumns = (options?: CreateColumnsOptions): ColumnDef<Coupon>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const id = row.original.id;
      // Format: #CP-XXXX (last 4 chars)
      const shortId = id.slice(-4).toUpperCase();
      return (
        <span className="font-medium text-gray-500">
          #CP-{shortId}
        </span>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <span
          className={`inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-sm font-bold font-mono tracking-wide border border-gray-200 ${
            isExpired
              ? "text-gray-500 line-through"
              : "text-primary"
          }`}
        >
          {coupon.code}
        </span>
      );
    },
  },
  {
    accessorKey: "discountPercent",
    header: "Discount",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <span
          className={`font-semibold ${isExpired ? "opacity-50" : ""}`}
        >
          {coupon.discountPercent}%
        </span>
      );
    },
  },
  {
    accessorKey: "minOrder",
    header: "Min Order",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      return (
        <span className={isExpired ? "opacity-50" : ""}>
          {formatCurrency(coupon.minOrder)}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      // Calculate used quantity (assuming we need to track this separately)
      // For now, showing total quantity
      const used = 0; // This should come from API if available
      const percentage = coupon.quantity > 0 ? (used / coupon.quantity) * 100 : 0;
      
      return (
        <div className={`flex flex-col gap-1 ${isExpired ? "opacity-50" : ""}`}>
          <span className="text-xs font-medium text-gray-500">
            {used} / {coupon.quantity} used
          </span>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={`h-1.5 rounded-full ${
                isExpired ? "bg-gray-400" : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Expiration",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const date = new Date(row.original.expirationDate);
      const isExpired = date < new Date();
      return (
        <span className={isExpired ? "opacity-50" : ""}>
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.expirationDate) < new Date();
      
      if (isExpired) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            Expired
          </span>
        );
      }
      
      if (!coupon.active) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            Disabled
          </span>
        );
      }
      
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Active
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: Row<Coupon> }) => {
      const coupon = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
            title="Chỉnh sửa"
            onClick={() => options?.onEdit?.(coupon)}
          >
            <Edit className="h-5 w-5" />
          </Button>
          <DeleteCouponButton coupon={coupon} />
        </div>
      );
    },
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
        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
        title="Xóa"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </ConfirmAlert>
  );
}

// Default export for backward compatibility
export const columns = createColumns();

