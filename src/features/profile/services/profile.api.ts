import { apiClient } from '@/lib/api';
import { UpdateProfileRequest, ChangePasswordRequest, Address } from '../types';
import { User } from '@/types';
import { ProductPaginationResponse } from '@/features/product/types';

export const profileApi = {
 

  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.result;
  },

  productsPurchased: async (userId: string): Promise<ProductPaginationResponse> => {
    const response = await apiClient.get<ProductPaginationResponse>(`/shoes/products/purchased?userId=${userId}`);
    return response.result;
  },
};
