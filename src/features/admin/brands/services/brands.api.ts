import { apiClient } from "@/lib";
import { BrandType } from "@/features/product/types";

export const adminBrandsApi = {
  /**
   * Upsert Brand (Create or Update)
   * Dùng chung API /shoes/brands/create
   * - Nếu có id trong FormData: update
   * - Nếu không có id: create
   */
  upsert: async (data: FormData): Promise<BrandType> => {
    const response = await apiClient.post<BrandType>(
      "/shoes/brands/create-or-update",
      data
    );
    return response.result;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/brands/delete/${id}`
    );
    return response.result;
  },
};
