import { apiClient } from '@/lib/api';
import { CategoryType } from '@/features/product/types';
import { categoriesApi } from '@/features/shared/services/categories.api';

export const adminCategoriesApi = {

  create: async (data: { name: string; description: string }): Promise<CategoryType> => {
    const response = await apiClient.post<CategoryType>('/shoes/categories/create', data);
    return response.result;
  },

  update: async (id: string, data: { name: string; description: string }): Promise<CategoryType> => {
    const response = await apiClient.put<CategoryType>(`/shoes/categories/update/${id}`, data);
    return response.result;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(`/shoes/categories/delete/${id}`);
    return response.result;
  },
};