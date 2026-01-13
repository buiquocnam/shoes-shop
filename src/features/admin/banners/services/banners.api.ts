import axiosInstance from "@/lib/axios";
import { Banner, BannerPaginationResponse } from "@/types/banner";

export const adminBannersApi = {
  search: async () => {
    const response = await axiosInstance.get<BannerPaginationResponse>(
      `/shoes/banners/search`
    );
    return response.data;
  },

  createOrUpdate: async (data: FormData) => {
    const response = await axiosInstance.post<Banner>(
      "/shoes/banners/create-or-update",
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/shoes/banners/${id}`);
    return response.data;
  },
};

