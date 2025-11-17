import { apiClient } from "@/lib/api";
import { CategoryType } from "@/features/product/types";

export const categoriesApi = {
  getAll: async (): Promise<CategoryType[]> => {
    const response = await apiClient.get<CategoryType[]>('/shoes/categories/get-all');
    return response.result;
  },
};

