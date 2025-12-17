import { apiClient } from "@/lib/api";
import {
  ProductDetailType,
  ProductFilters,
  ProductPaginationResponse,
  ProductType,
} from "../types";
import { toQueryString } from "@/utils/queryString";

export const productApi = {
  getProducts: async (filters?: ProductFilters) => {
    const response = await apiClient.get<ProductPaginationResponse>(
      `/shoes/products/search${toQueryString(filters)}`
    );
    return response.result;
  },

  getProductById: async (id: string): Promise<ProductDetailType> => {
    const response = await apiClient.get<ProductDetailType>(
      `/shoes/products/get-by-id/${id}`
    );
    return response.result;
  },

  getTopRatedProducts: async () => {
    const response = await apiClient.get<ProductType[]>(
      `/shoes/products/top-rated`
    );
    return response.result;
  },
};
