"use client";

import React, { useState } from "react";
import { BannerCard } from "@/features/admin/banners";
import { useUpsertBanner, useBanners, useDeleteBanner } from "@/features/admin/banners";
import { BannerSlot } from "@/types/banner";
import Loading from "@/features/admin/components/Loading";
import { Image as ImageIcon } from "lucide-react";

const BANNER_SLOTS: BannerSlot[] = ["HOME_HERO", "HOME_MID", "SIDEBAR"];

const AdminBannersPage: React.FC = () => {
  const upsertBannerMutation = useUpsertBanner();
  const deleteBannerMutation = useDeleteBanner();
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

  const handleToDelete = async (id: string, slot: BannerSlot) => {
    try {
      setLoadingSlot(slot);
      await deleteBannerMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete banner error:", error);
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
        {BANNER_SLOTS.map((slot, index) => {
          const banner = allBanners.find(b => b.slot === slot);
          return (
            <BannerCard
              key={slot}
              banner={banner}
              slot={slot}
              index={index}
              onSubmit={handleUpsertBanner}
              onDelete={(id) => handleToDelete(id, slot)}
              isLoading={loadingSlot === slot}
            />
          );
        })}
      </div>

    </div>
  );
};

export default AdminBannersPage;

