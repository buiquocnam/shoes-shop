"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/features/product/types";
import { ConfirmAlert } from "@/features/admin/components/ConfirmAlert";
import { useDeleteCategory } from "../hooks/useCategories";

export const categoryColumns = (
  onEdit?: (category: CategoryType) => void
): ColumnDef<CategoryType>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Tên danh mục
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 py-0 h-auto font-semibold text-gray-700 hover:bg-transparent hover:text-red-700"
        >
          Sản phẩm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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

