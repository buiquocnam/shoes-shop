import axiosInstance from "@/lib/axios";
import {
  ProductDetailType,
  ProductFilters,
  ProductPaginationResponse,
  ProductType,
} from "../types";
import { toQueryString } from "@/utils/queryString";

export const productApi = {
  getProducts: async (filters?: ProductFilters) => {
    const response = await axiosInstance.get<ProductPaginationResponse>(
      `/shoes/products/search${toQueryString(filters)}`
    );
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await axiosInstance.get<ProductDetailType>(
      `/shoes/products/get-by-id/${id}`
    );
    return response.data;
  },

  getTopRatedProducts: async () => {
    const response = await axiosInstance.get<ProductType[]>(
      `/shoes/products/top-rated`
    );
    return response.data;
  },
};
