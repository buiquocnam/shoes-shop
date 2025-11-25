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

const AdminCategoriesPage: React.FC = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const categoriesData: CategoryType[] = categories || [];

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    await createCategoryMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-xl text-gray-700">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Categories</h1>

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