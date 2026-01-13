import axiosInstance from "@/lib/axios";
import { CategoryType } from "@/features/product/types";
import { toQueryString } from "@/utils/queryString";
import { PaginatedResponse, PaginationParams } from "@/types";

export const categoriesApi = {
  getAll: async (filters?: PaginationParams) => {
    const queryString = toQueryString(filters);
    const response = await axiosInstance.get<PaginatedResponse<CategoryType>>(
      `/shoes/categories/get-all${queryString}`
    );
    return response.data;
  },
};
