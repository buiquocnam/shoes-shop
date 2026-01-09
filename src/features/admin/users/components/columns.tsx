"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";
import { useDeleteUser } from "../hooks/useUsers";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";

export const userColumns = (
  onEdit?: (user: User) => void,
  onViewPurchasedItems?: (user: User) => void
): ColumnDef<User>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên người dùng" />
      ),
      cell: ({ row }) => {
        const name = row.original.name;
        return <span className="font-medium">{name}</span>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Điện thoại" />
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("phone") || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              status
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            )}
          >
            {status ? "Hoạt động" : "Bị khóa"}
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
        return (
          <div className="flex items-center gap-1">
            {onViewPurchasedItems && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
                title="Xem đơn hàng"
                onClick={() => onViewPurchasedItems(row.original)}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="sr-only">Đơn hàng</span>
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Sửa</span>
              </Button>
            )}
            <DeleteUserButton user={row.original} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

// Delete User Button Component
function DeleteUserButton({ user }: { user: User }) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync([user.id]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmAlert
      onConfirm={handleDelete}
      itemName={`người dùng "${user.name}"`}
      title="Xác nhận xóa người dùng"
      description={`Bạn có chắc chắn muốn xóa người dùng "${user.name}"? Hành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
        title="Xóa"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmAlert>
  );
}