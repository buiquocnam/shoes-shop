import axiosInstance from "@/lib/axios";
import { BrandType } from "@/features/product/types";

export const adminBrandsApi = {
  /**
   * Upsert Brand (Create or Update)
   * Dùng chung API /shoes/brands/create
   * - Nếu có id trong FormData: update
   * - Nếu không có id: create
   */
  upsert: async (data: FormData) => {
    const response = await axiosInstance.post<BrandType>(
      "/shoes/brands/create-or-update",
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete<boolean>(
      `/shoes/brands/delete/${id}`
    );
    return response.data;
  },
};
