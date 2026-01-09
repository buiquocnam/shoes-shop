import axiosInstance from "@/lib/axios";
import { User } from "@/types";
import { toQueryString } from "@/utils/queryString";
import { UserPaginationResponse, UserFilters } from "@/types/user";
import {
  PurchasedListPaginationResponse,
  PurchasedItemFilters,
} from "@/features/profile/types";
import { OrderDetail } from "@/types/order";

export const adminUsersApi = {
  getUsers: async (filters?: UserFilters) => {
    const response = await axiosInstance.get<UserPaginationResponse>(
      `/auth/users/search${toQueryString(filters)}`
    );
    return response.data;
  },

  updateUser: async (data: Partial<User>) => {
    const response = await axiosInstance.post<User>(
      `/auth/users/update-user`, 
      data
    );
    return response.data;
  },

  deleteUser: async (userIds: string[]) => {
    const response = await axiosInstance.delete<boolean>(
      `/auth/users/delete-user`,
      { data: userIds }
    );
    return response.data;
  },

  getPurchasedItems: async (
    userId: string,
    filters?: PurchasedItemFilters
  ) => {
    const response = await axiosInstance.get<PurchasedListPaginationResponse>(
      `/shoes/products/purchased/by-user/${userId}${toQueryString(filters)}`
    );
    return response.data;
  },

  getOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<OrderDetail>(
      `/shoes/products/order-detail/${orderId}`
    );
    return response.data;
  },
};
