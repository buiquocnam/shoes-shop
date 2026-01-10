"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  BannerForm,
  bannerColumns,
  useBanners,
  useUpsertBanner,
} from "@/features/admin/banners";
import { Banner } from "@/types/banner";
import Loading from "@/features/admin/components/Loading";
import { SearchInput } from "@/features/admin/components/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminBannersPage: React.FC = () => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Fetch all banners (no pagination)
  const { data, isLoading } = useBanners();
  const upsertBannerMutation = useUpsertBanner();
  const allBanners: Banner[] = data?.data || [];

  // Client-side filtering
  const filteredBanners = useMemo(() => {
    let filtered = allBanners;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(banner =>
        banner.title.toLowerCase().includes(query)
      );
    }

    // Filter by active status
    if (activeFilter !== "all") {
      const isActive = activeFilter === "true";
      filtered = filtered.filter(banner => banner.active === isActive);
    }

    return filtered;
  }, [allBanners, searchQuery, activeFilter]);

  const handleSearch = useCallback((search?: string) => {
    setSearchQuery(search || "");
  }, []);

  const handleActiveFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  const handleUpsertBanner = async (formData: FormData) => {
    await upsertBannerMutation.mutateAsync(formData);
    setSelectedBanner(null);
    setCreateFormOpen(false);
  };

  const handleEdit = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
  }, []);

  const columns = useMemo(() => bannerColumns(handleEdit), [handleEdit]);

  if (isLoading && allBanners.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Header onCreateClick={() => setCreateFormOpen(true)} />

      <DataTable
        columns={columns}
        data={filteredBanners}
        toolbar={
          <div className="flex items-center gap-2">
            <SearchInput
              onSearch={handleSearch}
              defaultValue={searchQuery}
              placeholder="Tiêu đề..."
              className="h-10 w-[150px] lg:w-[250px]"
            />
            <Select
              value={activeFilter}
              onValueChange={handleActiveFilterChange}
            >
              <SelectTrigger className="h-10 w-[130px] bg-white border-border/50">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Đã ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <BannerForm
        onSubmit={handleUpsertBanner}
        isLoading={upsertBannerMutation.isPending}
        open={createFormOpen}
        onOpenChange={setCreateFormOpen}
        trigger={null}
      />

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

// Memoized Header component
const Header = React.memo(({ onCreateClick }: { onCreateClick: () => void }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
        Banner
      </h1>
      <p className="text-sm text-muted-foreground">
        Quản lý các hình ảnh quảng cáo và banner hiển thị trên website.
      </p>
    </div>
    <Button
      onClick={onCreateClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
    >
      + Thêm banner
    </Button>
  </div>
));

Header.displayName = "BannersHeader";

export default AdminBannersPage;
