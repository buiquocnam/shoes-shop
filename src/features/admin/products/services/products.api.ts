"use client";

import { apiClient } from "@/lib";
import {
  ProductType,
  ProductFilters,
  ProductPaginationResponse,
  ProductDetailType,
} from "@/features/product/types";
import { toQueryString } from "@/utils/queryString";
import type {
  CreateProductInput,
  UpdateProductInfoInput,
  VariantInput,
  UpsertVariantsInput,
  ImportStockInput,
  VariantResponse,
  VariantHistoryItem,
  VariantHistoryFilters,
  VariantHistoryPaginationResponse,
  PurchasedProductByProductPaginationResponse,
  PurchasedItemFilters,
} from "../types";
import { OrderDetail } from "@/features/shared/types/order";

export const adminProductsApi = {
  /**
   * Get Products with filters
   */
  getProducts: async (
    filters?: ProductFilters
  ): Promise<ProductPaginationResponse> => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await apiClient.get<ProductPaginationResponse>(
      `/shoes/products/get-all${queryParams}`
    );
    return response.result;
  },

  /**
   * Get Product by ID
   */
  getProductById: async (productId: string): Promise<ProductDetailType> => {
    const response = await apiClient.get<ProductDetailType>(
      `/shoes/products/get-by-id/${productId}`
    );
    return response.result;
  },

  /**
   * Create Product
   * Payload: FormData với JSON body (request) + multipart files (files)
   */
  create: async (data: FormData): Promise<ProductType> => {
    const response = await apiClient.post<ProductType>(
      `/shoes/products/create-product`,
      data
    );
    return response.result;
  },

  /**
   * Update Product Info
   */
  updateInfo: async (data: UpdateProductInfoInput): Promise<ProductType> => {
    const response = await apiClient.patch<ProductType>(
      `/shoes/products/update/content`,
      data
    );
    return response.result;
  },

  /**
   * Upsert Variants
   * Create or update variants and their sizes
   */
  upsertVariants: async (
    data: UpsertVariantsInput
  ): Promise<VariantResponse[]> => {
    const response = await apiClient.post<VariantResponse[]>(
      `/shoes/variants/upsert`,
      data
    );
    return response.result;
  },

  /**
   * Import Stock
   * Gọi API import stock riêng, không gộp với create/update variant
   */
  importStock: async (data: ImportStockInput): Promise<boolean> => {
    const response = await apiClient.post<boolean>(
      `/shoes/variants/import-stock`,
      {
        productId: data.productId,
        items: data.items,
      }
    );
    return response.result;
  },

  /**
   * Update Images
   * Update danh sách name + primaryName qua JSON
   */
  updateImages: async (data: FormData): Promise<boolean> => {
    const response = await apiClient.post<boolean>(
      `/shoes/products/update/image`,
      data
    );
    return response.result;
  },

  /**
   * Delete Product
   */
  delete: async (productId: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/products/delete?productId=${productId}`
    );
    return response.result;
  },

  /**
   * Delete Variant
   */
  deleteVariant: async (variantId: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/variants/delete/${variantId}`
    );
    return response.result;
  },

  /**
   * Delete Variant Size
   */
  deleteVariantSize: async (sizeId: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/variants/delete-size/${sizeId}`
    );
    return response.result;
  },

  /**
   * Get Purchased Items by Product
   * Endpoint: /shoes/products/purchased/by-product/{productId}
   */
  getPurchasedItems: async (
    productId: string,
    filters?: PurchasedItemFilters
  ): Promise<PurchasedProductByProductPaginationResponse> => {
    const queryParams = filters
      ? toQueryString({
          page: filters.page,
          size: filters.limit,
        })
      : "";
    const response = await apiClient.get<PurchasedProductByProductPaginationResponse>(
      `/shoes/products/purchased/by-product/${productId}${queryParams}`
    );
    return response.result;
  },

  /**
   * Get Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order/{id}
   */
  getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      `/shoes/products/order/${orderId}`
    );
    return response.result;
  },

  /**
   * Get Variant History
   */
  getVariantHistory: async (
    filters?: VariantHistoryFilters
  ): Promise<VariantHistoryPaginationResponse> => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await apiClient.get<VariantHistoryPaginationResponse>(
      `/shoes/variants/history${queryParams}`
    );
    return response.result;
  },
};
