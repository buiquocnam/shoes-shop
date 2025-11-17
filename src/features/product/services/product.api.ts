import { apiClient } from '@/lib/api';
import { ProductDetailType, ProductFilters, ProductPaginationResponse, ProductType } from '../types';
import { toQueryString } from '@/utils/queryString';

export const getProducts = async (filters?: ProductFilters) => {
    const response = await apiClient.get<ProductPaginationResponse>(
        `/shoes/products/get-all${toQueryString(filters)}`
    );
    return response.result;
};



export const getProductById = async (id: string): Promise<ProductDetailType> => {
    try {
        const response = await apiClient.get<ProductDetailType>(`/shoes/products/get-by-id/${id}`);
        return response.result;
    } catch (error) {
        console.error('Get product by ID error:', error);
        throw error;
    }
};


export const getProductBySlug = async (slug: string): Promise<ProductType> => {
    try {
        const response = await apiClient.get<ProductType>(`/shoes/products/slug/${slug}`);
        return response.result;
    } catch (error) {
        console.error('Get product by slug error:', error);
        throw error;
    }
};