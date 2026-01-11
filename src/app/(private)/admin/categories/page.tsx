"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CategoryType } from "@/features/product/types";
import {
  CategoryForm,
  categoryColumns,
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/features/admin/categories";
import Loading from "@/features/admin/components/Loading";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { useSearchParams } from "next/navigation";
import { SearchInput } from "@/features/admin/components/SearchInput";

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

  const filters: CategoryFilters = useMemo(
    () => ({
      page,
      size,
      name: nameFromUrl,
    }),
    [page, size, nameFromUrl]
  );

  const { data: categories, isLoading } = useGetCategories(filters);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const categoriesData: CategoryType[] = categories?.data || [];

  const pagination = useMemo(() => ({
    currentPage: categories?.currentPage || page,
    totalPages: categories?.totalPages || 1,
    totalElements: categories?.totalElements || 0,
    pageSize: categories?.pageSize || size,
  }), [categories, page, size]);

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

  const handleEdit = useCallback((category: CategoryType) => {
    setSelectedCategory(category);
  }, []);

  const columns = useMemo(() => categoryColumns(handleEdit), [handleEdit]);

  if (isLoading && categoriesData.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Danh mục
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các danh mục phân loại sản phẩm của cửa hàng.
          </p>
        </div>
        <CategoryForm
          onSubmit={handleCreateCategory}
          isLoading={createCategoryMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              + Thêm danh mục
            </Button>
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={categoriesData}
        pagination={pagination}
        onPageChange={(p) => updateParams({ page: p })}
        toolbar={
          <SearchInput
            onSearch={handleSearch}
            defaultValue={nameFromUrl}
            placeholder="Tìm kiếm danh mục..."
            className="h-10 w-[200px] lg:w-[300px]"
          />
        }
      />

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