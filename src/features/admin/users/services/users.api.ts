import { apiClient } from "@/lib";
import { BrandType } from "@/features/product/types";
import { User } from "@/types/global";
import { toQueryString } from "@/utils/queryString";
import { Filters } from "@/features/shared/types";
import { UserUpdate } from "../types";
import { PurchasedItem } from "@/features/profile/types";

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

  deleteUser: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(`/auth/users/delete-user`);
    return response.result;
  },

  getPurchasedItems: async (userId: string): Promise<PurchasedItem[]> => {
    const response = await apiClient.get<PurchasedItem[]>(
      `/shoes/products/purchased/by-user/${userId}`
    );
    return response.result;
  },
};
