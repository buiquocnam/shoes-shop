"use client";

import React, { useState } from "react";
import { BannerCard } from "@/features/admin/banners";
import { useUpsertBanner, useBanners } from "@/features/admin/banners";
import { BannerSlot } from "@/types/banner";
import Loading from "@/features/admin/components/Loading";
import { Image as ImageIcon } from "lucide-react";

const BANNER_SLOTS: BannerSlot[] = ["HOME_HERO", "HOME_MID", "SIDEBAR"];

const AdminBannersPage: React.FC = () => {
  const upsertBannerMutation = useUpsertBanner();
  const [loadingSlot, setLoadingSlot] = useState<BannerSlot | null>(null);

  const { data, isLoading } = useBanners();
  const allBanners = data?.data || [];

  const handleUpsertBanner = async (formData: FormData) => {
    // Extract slot from request blob to track which card is loading
    let slotBeingUpdated: BannerSlot | undefined;
    try {
      const requestBlob = formData.get("request") as Blob;
      if (requestBlob) {
        const text = await requestBlob.text();
        const bannerData = JSON.parse(text);
        slotBeingUpdated = bannerData.slot as BannerSlot;
        setLoadingSlot(slotBeingUpdated);
      }

      await upsertBannerMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Upsert banner error:", error);
    } finally {
      setLoadingSlot(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Quản lý Banner
          </h1>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border text-sm font-medium">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span>{allBanners.length} / {BANNER_SLOTS.length} Vị trí đã thiết lập</span>
        </div>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {BANNER_SLOTS.map((slot) => {
          const banner = allBanners.find(b => b.slot === slot);
          return (
            <BannerCard
              key={slot}
              banner={banner}
              slot={slot}
              onSubmit={handleUpsertBanner}
              isLoading={loadingSlot === slot || (upsertBannerMutation.isPending && loadingSlot === slot)}
            />
          );
        })}
      </div>

      {/* Helper Footer */}
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground flex items-start gap-4 shadow-sm">
        <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full border flex items-center justify-center font-bold">!</div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground italic">Mẹo nhỏ:</p>
          <ul className="list-disc ml-4 space-y-1 opacity-80 decoration-primary">
            <li>Vị trí <span className="font-medium text-foreground">HOME_HERO</span> thường hiển thị ở đầu trang với kích thước lớn nhất.</li>
            <li>Đảm bảo hình ảnh tải lên có dung lượng tối ưu để trang web tải nhanh hơn.</li>
            <li>Khi tắt trạng thái <span className="font-medium text-foreground">Hoạt động</span>, banner sẽ bị ẩn ngay lập tức trên trang chủ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminBannersPage;
