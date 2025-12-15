"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BrandType } from "@/features/product/types";
import {
  BrandForm,
  brandColumns,
  useBrands,
  useCreateBrand
} from "@/features/admin/brands";
import Loading from "@/features/admin/components/Loading";

const AdminBrandsPage: React.FC = () => {
  const { data, isLoading } = useBrands({});
  const createBrandMutation = useCreateBrand();
  const brands: BrandType[] = data?.data || [];

  const handleCreateBrand = async (formData: FormData) => {
    await createBrandMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Brands</h1>

        <BrandForm
          onSubmit={handleCreateBrand}
          isLoading={createBrandMutation.isPending}
          trigger={
            <Button className="bg-red-700 hover:bg-red-800 font-semibold px-4 py-2 rounded-lg shadow-md">
              + Add Brand
            </Button>
          }
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <DataTable
          columns={brandColumns}
          data={brands}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalElements: brands.length,
            pageSize: 10,
          }}
        />
      </div>
    </div>
  );
};

export default AdminBrandsPage;
