"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  BannerForm,
  bannerColumns,
  useBanners,
  useUpsertBanner,
  BannerType,
} from "@/features/admin/banners";
import Loading from "@/features/admin/components/Loading";
import { useSearchParams, useRouter } from "next/navigation";
import { useUpdateParams } from "@/features/admin/util/updateParams";
import { SearchInput } from "@/features/admin/components/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filters = {
  page?: number;
  size?: number;
  title?: string;
  active?: boolean;
};

const AdminBannersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const updateParams = useUpdateParams();
  const [selectedBanner, setSelectedBanner] = useState<BannerType | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

  /** ---------------- derive filters from URL ---------------- */
  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 10);
  const titleFromUrl = searchParams.get("title") || "";
  const activeFromUrl = searchParams.get("active");

  const handleSearch = useCallback((search?: string) => {
    updateParams({ title: search, page: 1 });
  }, [updateParams]);

  const handleActiveFilterChange = useCallback((value: string) => {
    if (value === "all") {
      updateParams({ active: undefined, page: 1 });
    } else {
      updateParams({ active: value, page: 1 });
    }
  }, [updateParams]);

  const filters: Filters = useMemo(() => ({
    page,
    size,
    title: titleFromUrl || undefined,
    active: activeFromUrl === null ? undefined : activeFromUrl === "true",
  }), [page, size, titleFromUrl, activeFromUrl]);

  const { data, isLoading } = useBanners(filters);
  const upsertBannerMutation = useUpsertBanner();
  const banners: BannerType[] = data?.data || [];

  const handleUpsertBanner = async (formData: FormData) => {
    await upsertBannerMutation.mutateAsync(formData);
    setSelectedBanner(null);
    setCreateFormOpen(false);
  };

  const handleEdit = useCallback((banner: BannerType) => {
    setSelectedBanner(banner);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  const columns = useMemo(() => bannerColumns(handleEdit), [handleEdit]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý banner
        </h1>
        <BannerForm
          onSubmit={handleUpsertBanner}
          isLoading={upsertBannerMutation.isPending}
          open={createFormOpen}
          onOpenChange={setCreateFormOpen}
          trigger={
            <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover">
              + Thêm banner
            </Button>
          }
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            onSearch={handleSearch}
            defaultValue={titleFromUrl}
            placeholder="Tìm kiếm theo tiêu đề..."
            withContainer
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select
            value={
              activeFromUrl === null
                ? "all"
                : activeFromUrl === "true"
                ? "true"
                : "false"
            }
            onValueChange={handleActiveFilterChange}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Hoạt động</SelectItem>
              <SelectItem value="false">Ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={banners}
          pagination={{
            currentPage: data?.currentPage || 1,
            totalPages: data?.totalPages || 1,
            totalElements: data?.totalElements || 0,
            pageSize: data?.pageSize || 10,
          }}
          onPageChange={handlePageChange}
        />
      )}

      {selectedBanner && (
        <BannerForm
          banner={selectedBanner}
          onSubmit={handleUpsertBanner}
          isLoading={upsertBannerMutation.isPending}
          open={!!selectedBanner}
          onOpenChange={(open) => {
            if (!open) setSelectedBanner(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminBannersPage;

