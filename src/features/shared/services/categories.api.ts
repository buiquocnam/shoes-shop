import { apiClient } from "@/lib/api";
import { CategoryType } from "@/features/product/types";
import { Filters } from "../types";
import { toQueryString } from "@/utils/queryString";
import { PaginatedResponse } from "@/types/global";

export const categoriesApi = {
  getAll: async (filters?: Filters): Promise<CategoryType[]> => {
    const queryString = toQueryString(filters);
    const response = await apiClient.get<PaginatedResponse<CategoryType>>(
      `/shoes/categories/get-all${queryString}`
    );
    return response.result.data;
  },
};
