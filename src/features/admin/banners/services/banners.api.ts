import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import {
  BannerType,
  FetchBannersParams,
  BannerPaginationResponse,
  BannerSlot,
} from "../types";

export const adminBannersApi = {
  /**
   * Search banners with filters
   */
  search: async (
    filters?: FetchBannersParams
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
    const response = await axiosInstance.get<BannerType[]>(
      `/shoes/banners/get-by-slot/${slot}`
    );
    return response.data;
  },

  /**
   * Create or Update Banner
   * Uses FormData with request JSON and file
   */
  createOrUpdate: async (data: FormData) => {
    const response = await axiosInstance.post<BannerType>(
      "/shoes/banners/create-or-update",
      data
    );
    return response.data;
  },
};

