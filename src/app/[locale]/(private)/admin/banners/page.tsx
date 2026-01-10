"use client";

import React, { useMemo, useState } from "react";
import { BannerCard } from "@/features/admin/banners";
import { useUpsertBanner, useBanners } from "@/features/admin/banners";
import { BannerSlot } from "@/types/banner";
import Loading from "@/features/admin/components/Loading";

const BANNER_SLOTS: BannerSlot[] = ["HOME_HERO", "HOME_MID", "HOME_BOTTOM"];

const AdminBannersPage: React.FC = () => {
  const upsertBannerMutation = useUpsertBanner();
  const [loadingSlot, setLoadingSlot] = useState<BannerSlot | null>(null);

  // Fetch all banners once
  const { data, isLoading } = useBanners();
  const allBanners = data?.data || [];


  const handleUpsertBanner = async (formData: FormData) => {
    try {
      // Parse slot từ formData để xác định card nào đang loading
      const requestBlob = formData.get("request") as Blob;
      if (requestBlob) {
        const text = await requestBlob.text();
        const bannerData = JSON.parse(text);
        const slot = bannerData.slot as BannerSlot;
        setLoadingSlot(slot);
      }
      await upsertBannerMutation.mutateAsync(formData);
    } finally {
      setLoadingSlot(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Quản lý Banner
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý 3 vị trí banner trên trang chủ. Mỗi vị trí chỉ có thể có 1 banner duy nhất.
          </p>
        </div>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {BANNER_SLOTS.map((slot) => {
          const banner = allBanners.find(b => b.slot === slot);
          return (
            <BannerCard
              key={banner?.id || slot}
              banner={banner}
              onSubmit={handleUpsertBanner}
              isLoading={loadingSlot === banner?.slot}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AdminBannersPage;
