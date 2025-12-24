import { apiClient } from "@/lib";
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
  ): Promise<BannerPaginationResponse> => {
    const response = await apiClient.get<BannerPaginationResponse>(
      `/shoes/banners/search${toQueryString(filters)}`
    );
    return response.result;
  },

  /**
   * Get banners by slot
   */
  getBySlot: async (slot: BannerSlot): Promise<BannerType[]> => {
    const response = await apiClient.get<BannerType[]>(
      `/shoes/banners/get-by-slot/${slot}`
    );
    return response.result;
  },

  /**
   * Create or Update Banner
   * Uses FormData with request JSON and file
   */
  createOrUpdate: async (data: FormData): Promise<BannerType> => {
    const response = await apiClient.post<BannerType>(
      "/shoes/banners/create-or-update",
      data
    );
    return response.result;
  },
};

