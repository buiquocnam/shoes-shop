import axiosInstance from '@/lib/axios';
import { CategoryType } from '@/features/product/types';
import { categoriesApi } from '@/features/shared/services/categories.api';

export const adminCategoriesApi = {

  create: async (data: { name: string; description: string }) => {
    const response = await axiosInstance.post<CategoryType>('/shoes/categories/create', data);
    return response.data;
  },

  update: async (id: string, data: { name: string; description: string }) => {
    const response = await axiosInstance.put<CategoryType>(`/shoes/categories/update/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete<boolean>(`/shoes/categories/delete/${id}`);
    return response.data;
  },
};