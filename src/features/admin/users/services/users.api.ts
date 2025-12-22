import { apiClient } from "@/lib";
import { BrandType } from "@/features/product/types";
import { User } from "@/types/global";
import { toQueryString } from "@/utils/queryString";
import { Filters } from "@/features/shared/types";
import { UserUpdate } from "../types";
import {
  PurchasedListPaginationResponse,
  PurchasedItemFilters,
} from "@/features/profile/types";
import { OrderDetail } from "@/features/shared/types/order";

export const adminUsersApi = {
  getUsers: async (filters?: Filters): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/auth/users/get-all`);
    return response.result;
  },

  updateUser: async (data: UserUpdate): Promise<User> => {
    const response = await apiClient.post<User>(
      `/auth/users/update-user`,
      data
    );
    return response.result;
  },

  /**
   * Delete Users
   * Body: array of user IDs ["id1", "id2", ...]
   */
  deleteUser: async (userIds: string[]): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/auth/users/delete-user`,
      userIds
    );
    return response.result;
  },

  /**
   * Get Purchased Items by User
   * Endpoint: /shoes/products/purchased/by-user/{userId}
   */
  getPurchasedItems: async (
    userId: string,
    filters?: PurchasedItemFilters
  ): Promise<PurchasedListPaginationResponse> => {
    const queryParams = filters
      ? toQueryString({
          page: filters.page,
          size: filters.limit,
        })
      : "";
    const response = await apiClient.get<PurchasedListPaginationResponse>(
      `/shoes/products/purchased/by-user/${userId}${queryParams}`
    );
    return response.result;
  },

  /**
   * Get Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order-detail/{id}
   */
  getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      `/shoes/products/order-detail/${orderId}`
    );
    return response.result;
  },
};
