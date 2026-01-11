import axiosInstance from "@/lib/axios";
import { BannerPaginationResponse } from "@/types/banner";

export const bannersApi = {
  /**
   * Search banners (public API, no auth required)
   */
  search: async () => {
    const banners = await axiosInstance.get<BannerPaginationResponse>(
      `/shoes/banners/search`
    );
    return banners.data;
  },
};

