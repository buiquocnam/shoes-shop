import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import { BrandPaginationResponse, FetchBrandsParams } from "../types";

export const brandsApi = {
  search: async (filters?: FetchBrandsParams) => {
    const brands = await axiosInstance.get<BrandPaginationResponse>(
      `/shoes/brands/search${toQueryString(filters)}`
    );
    return brands.data;
  },
};

