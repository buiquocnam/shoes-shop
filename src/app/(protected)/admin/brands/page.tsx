"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BrandType } from "@/features/product/types";
import {
  BrandForm,
  brandColumns,
  useBrands,
  useUpsertBrand,
  useDeleteBrand,
} from "@/features/admin/brands";
import Loading from "@/features/admin/components/Loading";
import { useSearchParams } from "next/navigation";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { Input } from "@/components/ui/input";
import { ConfirmAlert } from "@/features/admin/components";


type Filters = {
  page?: number;
  size?: number;
  search?: string;
};

const AdminBrandsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedBrand, setSelectedBrand] = useState<BrandType | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<BrandType | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

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
  const upsertBrandMutation = useUpsertBrand();
  const deleteBrandMutation = useDeleteBrand();
  const brands: BrandType[] = data?.data || [];

  const handleUpsertBrand = async (formData: FormData) => {
    await upsertBrandMutation.mutateAsync(formData);
    setSelectedBrand(null);
    setCreateFormOpen(false);
  };

  const handleEdit = (brand: BrandType) => {
    setSelectedBrand(brand);
  };

  const handleDelete = async () => {
    if (brandToDelete) {
      await deleteBrandMutation.mutateAsync(brandToDelete.id);
      setBrandToDelete(null);
    }
  };

  const columns = brandColumns(handleEdit, (brand) => {
    setBrandToDelete(brand);
  });

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý thương hiệu</h1>

        <div className="flex justify-end gap-2">
          <Input
            placeholder="Tìm kiếm tên thương hiệu..."
            className="w-64"
            onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
          />
        </div>
        <BrandForm
          onSubmit={handleUpsertBrand}
          isLoading={upsertBrandMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="bg-red-700 hover:bg-red-800 font-semibold px-4 py-2 rounded-lg shadow-md">
              + Thêm thương hiệu
            </Button>
          }
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={brands}
          pagination={{
            currentPage: 1,
            totalPages: 1,
            totalElements: brands.length,
            pageSize: 10,
          }}
        />
      </div>

      {/* Edit Form */}
      {selectedBrand && (
        <BrandForm
          brand={selectedBrand}
          onSubmit={handleUpsertBrand}
          isLoading={upsertBrandMutation.isPending}
          open={!!selectedBrand}
          onOpenChange={(open) => {
            if (!open) setSelectedBrand(null);
          }}
        />
      )}

      {/* Delete Alert */}
      {brandToDelete && (
        <ConfirmAlert
          onConfirm={handleDelete}
          itemName={brandToDelete.name}
          open={!!brandToDelete}
          onOpenChange={(open) => {
            if (!open) setBrandToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminBrandsPage;
