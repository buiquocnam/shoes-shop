import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import { BannerPaginationResponse, FetchBannersParams } from "@/features/admin/banners/types";

export const bannersApi = {
  /**
   * Search banners with filters (public API, no auth required)
   */
  search: async (
    filters?: FetchBannersParams
  ) => {
    const banners = await axiosInstance.get<BannerPaginationResponse>(
      `/shoes/banners/search${toQueryString(filters)}`
    );
    return banners.data;
  },
};

