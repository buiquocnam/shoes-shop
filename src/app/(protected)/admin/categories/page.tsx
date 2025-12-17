"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CategoryType } from "@/features/product/types";
import {
  CategoryForm,
  categoryColumns,
  useCategories,
  useCreateCategory,
} from "@/features/admin/categories";
import Loading from "@/features/admin/components/Loading";
import { Input } from "@/components/ui/input";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { useSearchParams } from "next/navigation";

interface CategoryFilters {
  page?: number;
  size?: number;
  name?: string;
}

const AdminCategoriesPage: React.FC = () => {
  const searchParams = useSearchParams();
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
  const updateParams = useUpdateParams();
  const createCategoryMutation = useCreateCategory();

  const categoriesData: CategoryType[] = categories || [];

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    await createCategoryMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Categories</h1>
        <div className="flex justify-end gap-2">
          <Input
            placeholder="Search category name..."
            className="w-64"
            onChange={(e) =>
              updateParams({ name: e.target.value, page: 1 })
            }
          />
        </div>
        <CategoryForm
          onSubmit={handleCreateCategory}
          isLoading={createCategoryMutation.isPending}
          trigger={
            <Button className="bg-red-700 hover:bg-red-800 font-semibold px-4 py-2 rounded-lg shadow-md">
              + Add Category
            </Button>
          }
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <DataTable
          columns={categoryColumns}
          data={categoriesData}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalElements: categoriesData.length,
            pageSize: 10,
          }}
        />
      </div>
    </div>
  );
};

export default AdminCategoriesPage;