"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/global";
import { cn } from "@/lib/utils";

export const userColumns = (
  onEdit?: (user: User) => void,
  onDelete?: (user: User) => void,
  onViewPurchasedItems?: (user: User) => void
): ColumnDef<User>[] => [
    {
      accessorKey: "name",
      header: "Tên",
      cell: ({ row }: { row: Row<User> }) => {
        const name = row.original.name;
        return <span className="">{name}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Điện thoại
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: Row<User> }) => {
        const status = row.original.status;
        return (
          <span
            className={cn(
              "font-medium",
              status ? "text-green-600" : "text-red-600"
            )}
          >
            {status ? "Hoạt động" : "Không hoạt động"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: Row<User> }) => {
        return (
          <div className="flex space-x-1">
            {onViewPurchasedItems && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                title="Xem sản phẩm đã mua"
                onClick={() => onViewPurchasedItems(row.original)}
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];