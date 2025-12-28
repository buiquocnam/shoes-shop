import axiosInstance from "@/lib/axios";
import { User } from "@/types/global";
import { toQueryString } from "@/utils/queryString";
import { UserUpdate, UserPaginationResponse, UserFilters } from "../types";
import {
  PurchasedListPaginationResponse,
  PurchasedItemFilters,
} from "@/features/profile/types";
import { OrderDetail } from "@/features/shared/types/order";

export const adminUsersApi = {
  getUsers: async (filters?: UserFilters) => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await axiosInstance.get<UserPaginationResponse>(
      `/auth/users/search${queryParams}`
    );
    return response.data;
  },

  updateUser: async (data: UserUpdate) => {
    const response = await axiosInstance.post<User>(
      `/auth/users/update-user`,
      data
    );
    return response.data;
  },

  /**
   * Delete Users
   * Body: array of user IDs ["id1", "id2", ...]
   */
  deleteUser: async (userIds: string[]) => {
    const response = await axiosInstance.delete<boolean>(
      `/auth/users/delete-user`,
      { data: userIds }
    );
    return response.data;
  },

  /**
   * Get Purchased Items by User
   * Endpoint: /shoes/products/purchased/by-user/{userId}
   */
  getPurchasedItems: async (
    userId: string,
    filters?: PurchasedItemFilters
  ) => {
    const queryParams = filters
      ? toQueryString({
          page: filters.page,
          size: filters.limit,
        })
      : "";
    const response = await axiosInstance.get<PurchasedListPaginationResponse>(
      `/shoes/products/purchased/by-user/${userId}${queryParams}`
    );
    return response.data;
  },

  /**
   * Get Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order-detail/{id}
   */
  getOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<OrderDetail>(
      `/shoes/products/order-detail/${orderId}`
    );
    return response.data;
  },
};
