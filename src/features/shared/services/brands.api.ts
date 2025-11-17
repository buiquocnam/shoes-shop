import { apiClient } from "@/lib/api";
import { toQueryString } from "@/utils/queryString";
import { BrandPaginationResponse, FetchBrandsParams } from "../types";

export const brandsApi = {
  search: async (filters?: FetchBrandsParams): Promise<BrandPaginationResponse> => {
    const response = await apiClient.get<BrandPaginationResponse>(
      `/shoes/brands/search${toQueryString(filters)}`
    );
    return response.result;
  },
};

