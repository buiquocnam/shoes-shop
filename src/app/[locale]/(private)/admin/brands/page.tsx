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
    size,
    search: searchFromUrl,
  }), [size, searchFromUrl]);

  const { data, isLoading } = useBrands(filters);
  const upsertBrandMutation = useUpsertBrand();
  const brands: BrandType[] = data?.data || [];

  const pagination = useMemo(() => ({
    currentPage: data?.currentPage || page,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || brands.length,
    pageSize: data?.pageSize || size,
  }), [data, brands, page, size]);

  const handleUpsertBrand = async (formData: FormData) => {
    await upsertBrandMutation.mutateAsync(formData);
    setSelectedBrand(null);
    setCreateFormOpen(false);
  };

  const handleEdit = useCallback((brand: BrandType) => {
    setSelectedBrand(brand);
  }, []);

  const columns = useMemo(() => brandColumns(handleEdit), [handleEdit]);

  if (isLoading && brands.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Thương hiệu
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách các thương hiệu sản phẩm của cửa hàng.
          </p>
        </div>
        <BrandForm
          onSubmit={handleUpsertBrand}
          isLoading={upsertBrandMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              + Thêm thương hiệu
            </Button>
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={brands}
        pagination={pagination}
        onPageChange={(p) => updateParams({ page: p })}
        toolbar={
          <SearchInput
            onSearch={handleSearch}
            defaultValue={searchFromUrl}
            placeholder="Tìm kiếm thương hiệu..."
            className="h-10 w-[200px] lg:w-[300px]"
          />
        }
      />

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
