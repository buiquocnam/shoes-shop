"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/features/product/types";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";
import { useDeleteCategory } from "../hooks/useCategories";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const categoryColumns = (
  onEdit?: (category: CategoryType) => void
): ColumnDef<CategoryType>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên danh mục" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/products?category_id=${row.original.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }: { row: Row<CategoryType> }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-md truncate text-gray-600">
            {description || "Không có mô tả"}
          </div>
        );
      },
    },
    {
      accessorKey: "countProduct",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sản phẩm" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/products?category_id=${row.original.id}`}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {row.original.countProduct || 0} sản phẩm
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: Row<CategoryType> }) => {
        return (
          <div className="flex space-x-1">
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
            <DeleteCategoryButton category={row.original} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

// Delete Category Button Component
function DeleteCategoryButton({ category }: { category: CategoryType }) {
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(category.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmAlert
      onConfirm={handleDelete}
      itemName={`danh mục "${category.name}"`}
      title="Xác nhận xóa danh mục"
      description={`Bạn có chắc chắn muốn xóa danh mục "${category.name}"? Hành động này sẽ xóa tất cả dữ liệu liên quan và không thể hoàn tác.`}
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

