"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CategoryType } from "@/features/product/types";
import {
  CategoryForm,
  categoryColumns,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/admin/categories";
import Loading from "@/features/admin/components/Loading";
import { Input } from "@/components/ui/input";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { useSearchParams } from "next/navigation";
import { ConfirmAlert } from "@/features/admin/components";

interface CategoryFilters {
  page?: number;
  size?: number;
  name?: string;
}

const AdminCategoriesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const name = searchParams.get("name") || "";
  const filters: CategoryFilters = React.useMemo(
    () => ({
      page,
      size,
      name,
    }),
    [page, size, name]
  );

  const { data: categories, isLoading } = useCategories(filters);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categoriesData: CategoryType[] = categories || [];

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    await createCategoryMutation.mutateAsync(data);
    setCreateFormOpen(false);
  };

  const handleUpdateCategory = async (data: { name: string; description: string }) => {
    if (selectedCategory) {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        data,
      });
      setSelectedCategory(null);
    }
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const columns = categoryColumns(handleEdit, (category) => {
    setCategoryToDelete(category);
  });

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý danh mục</h1>
        <div className="flex justify-end gap-2">
          <Input
            placeholder="Tìm kiếm tên danh mục..."
            className="w-64"
            onChange={(e) =>
              updateParams({ name: e.target.value, page: 1 })
            }
          />
        </div>
        <CategoryForm
          onSubmit={handleCreateCategory}
          isLoading={createCategoryMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="bg-red-700 hover:bg-red-800 font-semibold px-4 py-2 rounded-lg shadow-md">
              + Thêm danh mục
            </Button>
          }
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={categoriesData}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalElements: categoriesData.length,
            pageSize: 10,
          }}
        />
      </div>

      {/* Edit Form */}
      {selectedCategory && (
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleUpdateCategory}
          isLoading={updateCategoryMutation.isPending}
          open={!!selectedCategory}
          onOpenChange={(open) => {
            if (!open) setSelectedCategory(null);
          }}
        />
      )}

      {/* Delete Alert */}
      {categoryToDelete && (
        <ConfirmAlert
          onConfirm={handleDelete}
          itemName={categoryToDelete.name}
          open={!!categoryToDelete}
          onOpenChange={(open) => {
            if (!open) setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;