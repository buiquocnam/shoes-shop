import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import { Banner, BannerFilters, BannerPaginationResponse, BannerSlot } from "@/types/banner";

export const adminBannersApi = {
  /**
   * Search banners with filters
   */
  search: async (
    filters?: BannerFilters
  ) => {
    const response = await axiosInstance.get<BannerPaginationResponse>(
      `/shoes/banners/search${toQueryString(filters)}`
    );
    return response.data;
  },

  /**
   * Get banners by slot
   */
  getBySlot: async (slot: BannerSlot) => {
    const response = await axiosInstance.get<Banner[]>(
      `/shoes/banners/get-by-slot/${slot}`
    );
    return response.data;
  },

  /**
   * Create or Update Banner
   * Uses FormData with request JSON and file
   */
  createOrUpdate: async (data: FormData) => {
    const response = await axiosInstance.post<Banner>(
      "/shoes/banners/create-or-update",
      data
    );
    return response.data;
  },
};

