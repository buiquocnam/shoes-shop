"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CategoryType } from "@/features/product/types";
import {
  CategoryForm,
  categoryColumns,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/admin/categories";
import Loading from "@/features/admin/components/Loading";
import { Input } from "@/components/ui/input";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/features/shared/hooks/useSearch";

interface CategoryFilters {
  page?: number;
  size?: number;
  name?: string;
}

const AdminCategoriesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const nameFromUrl = searchParams.get("name") || "";

  const handleSearch = useCallback((name?: string) => {
    updateParams({ name, page: 1 });
  }, [updateParams]);

  const searchInput = useSearch(nameFromUrl, handleSearch);

  const filters: CategoryFilters = React.useMemo(
    () => ({
      page,
      size,
      name: nameFromUrl,
    }),
    [page, size, nameFromUrl]
  );

  const { data: categories, isLoading } = useCategories(filters);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

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

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const columns = categoryColumns(handleEdit);

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
            value={searchInput.value}
            onChange={searchInput.onChange}
            onKeyDown={(e) => searchInput.onKeyDown(e, (value) => handleSearch(value))}
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
    </div>
  );
};

export default AdminCategoriesPage;