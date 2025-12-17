import { apiClient } from "@/lib/api";
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  PurchasedItemPaginationResponse,
  PurchasedItemFilters,
} from "../types";
import { User } from "@/types";
import { toQueryString } from "@/utils/queryString";

export const profileApi = {
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.post<User>(
      "/auth/users/update-user",
      data
    );
    return response.result;
  },

  productsPurchased: async (
    filters?: PurchasedItemFilters
  ): Promise<PurchasedItemPaginationResponse> => {
    const response = await apiClient.get<PurchasedItemPaginationResponse>(
      `/shoes/products/purchased${toQueryString(filters)}`
    );
    return response.result;
  },
};
