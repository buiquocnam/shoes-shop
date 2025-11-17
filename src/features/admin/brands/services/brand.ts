import { apiClient } from "@/lib";
import { BrandType } from "@/features/product/types";

export const adminBrandsApi = {
  create: async (data: FormData): Promise<BrandType> => {
    const response = await apiClient.post<BrandType>('/shoes/brands/create', data);
    return response.result;
  },

  update: async (id: string, data: FormData): Promise<BrandType> => {
    const response = await apiClient.put<BrandType>(`/shoes/brands/update/${id}`, data);
    return response.result;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/shoes/brands/delete/${id}`);
  },
};
