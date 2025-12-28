import axiosInstance from "@/lib/axios";
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  PurchasedListPaginationResponse,
  PurchasedItemFilters,
} from "../types";
import { User } from "@/types";
import { toQueryString } from "@/utils/queryString";

export const profileApi = {
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await axiosInstance.post<User>(
      "/auth/users/update-user",
      data
    );
    return response.data;
  },

  productsPurchased: async (
    filters?: PurchasedItemFilters
  ) => {
    const response = await axiosInstance.get<PurchasedListPaginationResponse>(
      `/shoes/products/purchased${toQueryString(filters)}`
    );
    return response.data;
  },
};
