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
import { useSearchParams } from "next/navigation";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { Input } from "@/components/ui/input";


type Filters = {
  page?: number;
  size?: number;
  search?: string;
};

const AdminBrandsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const search = searchParams.get("search") || "";
  const filters: Filters = {
    page,
    size,
    search,
  };
  
  const { data, isLoading } = useBrands(filters);
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

        <div className="flex justify-end gap-2">
          <Input
            placeholder="Search brand name..."
            className="w-64"
              onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
          />
        </div>
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
