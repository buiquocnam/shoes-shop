import { apiClient } from "@/lib/api";
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  PurchasedItem,
} from "../types";
import { User } from "@/types";
import { ProductPaginationResponse } from "@/features/product/types";

export const profileApi = {
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.post<User>(
      "/auth/users/update-user",
      data
    );
    return response.result;
  },

  productsPurchased: async (): Promise<PurchasedItem[]> => {
    const response = await apiClient.get<PurchasedItem[]>(
      `/shoes/products/purchased`
    );
    return response.result;
  },
};
