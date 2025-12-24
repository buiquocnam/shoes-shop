"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BrandType } from "@/features/product/types";
import {
  BrandForm,
  brandColumns,
  useBrands,
  useUpsertBrand,
} from "@/features/admin/brands";
import Loading from "@/features/admin/components/Loading";
import { useSearchParams } from "next/navigation";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { SearchInput } from "@/features/admin/components/SearchInput";


type Filters = {
  page?: number;
  size?: number;
  search?: string;
};

const AdminBrandsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const [selectedBrand, setSelectedBrand] = useState<BrandType | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const searchFromUrl = searchParams.get("search") || "";

  const handleSearch = useCallback((search?: string) => {
    updateParams({ search, page: 1 });
  }, [updateParams]);

  const filters: Filters = useMemo(() => ({
    page,
    size,
    search: searchFromUrl,
  }), [page, size, searchFromUrl]);

  const { data, isLoading } = useBrands(filters);
  const upsertBrandMutation = useUpsertBrand();
  const brands: BrandType[] = data?.data || [];

  const handleUpsertBrand = async (formData: FormData) => {
    await upsertBrandMutation.mutateAsync(formData);
    setSelectedBrand(null);
    setCreateFormOpen(false);
  };

  const handleEdit = useCallback((brand: BrandType) => {
    setSelectedBrand(brand);
  }, []);

  const columns = useMemo(() => brandColumns(handleEdit), [handleEdit]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý thương hiệu
        </h1>
        <BrandForm
          onSubmit={handleUpsertBrand}
          isLoading={upsertBrandMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover">
              + Thêm thương hiệu
            </Button>
          }
        />
      </div>

      <SearchInput
        onSearch={handleSearch}
        defaultValue={searchFromUrl}
        placeholder="Tìm kiếm tên thương hiệu..."
        withContainer
      />

      {isLoading ? (
        <Loading />
      ) : (
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
      )}

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
    </div>
  );
};

export default AdminBrandsPage;
