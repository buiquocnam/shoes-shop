import { apiClient } from "@/lib/api";
import { toQueryString } from "@/utils/queryString";
import { BannerPaginationResponse, FetchBannersParams } from "@/features/admin/banners/types";

export const bannersApi = {
  /**
   * Search banners with filters (public API, no auth required)
   */
  search: async (
    filters?: FetchBannersParams
  ): Promise<BannerPaginationResponse> => {
    const response = await apiClient.get<BannerPaginationResponse>(
      `/shoes/banners/search${toQueryString(filters)}`
    );
    return response.result;
  },
};

