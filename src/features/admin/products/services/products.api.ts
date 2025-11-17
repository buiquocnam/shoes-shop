import { apiClient } from '@/lib/api';
import { ProductContentInput, AdminProductFilters } from '../types';
import { ProductType, ProductPaginationResponse, ProductDetailType } from '@/features/product/types';
import { toQueryString } from '@/utils/queryString';
export const adminProductsApi = {
  // Lấy danh sách sản phẩm
  getAll: async (filters?: AdminProductFilters): Promise<ProductPaginationResponse> => {
    const response = await apiClient.get<ProductPaginationResponse>(`/shoes/products/get-all${toQueryString(filters)}`);
    return response.result;
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: string): Promise<ProductDetailType> => {
    const response = await apiClient.get<ProductDetailType>(`/shoes/products/get-by-id/${id}`);
    return response.result;
  },

  // Tạo sản phẩm mới (chỉ product + images)
  createProduct: async (data: FormData): Promise<{ id: string }> => {
    const response = await apiClient.post<{ id: string }>('/shoes/products/create-product', data);
    return response.result;
  },

  // Tạo variants cho product
  createVariants: async (data: { productId: string; variants: Array<{ color: string; size: number }> }): Promise<Array<{ id: string }>> => {
    const response = await apiClient.post<Array<{ id: string }>>('/shoes/variants/create-variant', data);
    return response.result;
  },

  // Import stock cho variants
  importStock: async (data: { productId: string; items: Array<{ variantId: string; count: number }> }): Promise<void> => {
    await apiClient.post('/shoes/variants/import-stock', data);
  },

  // Cập nhật sản phẩm
  updateContent: async (data: ProductContentInput): Promise<ProductDetailType> => {
    const response = await apiClient.patch<ProductDetailType>(`/shoes/products/update/content`, data);
    return response.result;
  },
  updateImages: async (data: FormData): Promise<ProductDetailType> => {
    const response = await apiClient.patch<ProductDetailType>(`/shoes/products/update/images`, data);
    return response.result;
  },



  // Xóa sản phẩm
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/shoes/products/delete?productId=${id}`);
  },
};
