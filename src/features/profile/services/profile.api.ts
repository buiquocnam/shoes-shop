import { apiClient } from '@/lib/api';
import { UpdateProfileRequest, ChangePasswordRequest, Address } from '../types';
import { User } from '@/types';
export const profileApi = {
 

  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.result;
  },

  // Thay đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  // Lấy danh sách địa chỉ
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get('/user/addresses');
    return response.data;
  },

  // Thêm địa chỉ
  addAddress: async (data: Omit<Address, 'id'>): Promise<Address> => {
    const response = await apiClient.post('/user/addresses', data);
    return response.data;
  },

  // Cập nhật địa chỉ
  updateAddress: async (id: string, data: Omit<Address, 'id'>): Promise<Address> => {
    const response = await apiClient.put(`/user/addresses/${id}`, data);
    return response.data;
  },

  // Xóa địa chỉ
  deleteAddress: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/user/addresses/${id}`);
    return response.data;
  },
};
