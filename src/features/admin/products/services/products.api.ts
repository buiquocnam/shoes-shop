"use client";

import axiosInstance from "@/lib/axios";
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
} from "../types";
import { PurchasedItemFilters } from "@/features/profile/types";
import { OrderDetail } from "@/types/order";

export const adminProductsApi = {
  /**
   * Get Products with filters
   */
  getProducts: async (
    filters?: ProductFilters
  ) => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await axiosInstance.get<ProductPaginationResponse>(
      `/shoes/products/get-all${queryParams}`
    );
    return response.data;
  },

  /**
   * Get Product by ID
   */
  getProductById: async (productId: string) => {
    const response = await axiosInstance.get<ProductDetailType>(
      `/shoes/products/get-by-id/${productId}`
    );
    return response.data;
  },

  /**
   * Create Product
   * Payload: FormData với JSON body (request) + multipart files (files)
   */
  create: async (data: FormData) => {
    const response = await axiosInstance.post<ProductType>(
      `/shoes/products/create-product`,
      data
    );
    return response.data;
  },

  /**
   * Update Product Info
   */
  updateInfo: async (data: UpdateProductInfoInput) => {
    const response = await axiosInstance.patch<ProductType>(
      `/shoes/products/update/content`,
      data
    );
    return response.data;
  },

  /**
   * Upsert Variants
   * Create or update variants and their sizes
   */
  upsertVariants: async (
    data: UpsertVariantsInput
  ) => {
    const response = await axiosInstance.post<VariantResponse[]>(
      `/shoes/variants/upsert`,
      data
    );
    return response.data;
  },

  /**
   * Import Stock
   * Gọi API import stock riêng, không gộp với create/update variant
   */
  importStock: async (data: ImportStockInput) => {
    const response = await axiosInstance.post<boolean>(
      `/shoes/variants/import-stock`,
      {
        productId: data.productId,
        items: data.items,
      }
    );
    return response.data;
  },

  /**
   * Update Images
   * Update danh sách name + primaryName qua JSON
   */
  updateImages: async (data: FormData) => {
    const response = await axiosInstance.post<boolean>(
      `/shoes/products/update/image`,
      data
    );
    return response.data;
  },

  /**
   * Delete Product
   */
  delete: async (productId: string) => {
    const response = await axiosInstance.delete<boolean>(
      `/shoes/products/delete?productId=${productId}`
    );
    return response.data;
  },

  /**
   * Delete Variant
   */
  deleteVariant: async (variantId: string) => {
    const response = await axiosInstance.delete<boolean>(
      `/shoes/variants/delete/${variantId}`
    );
    return response.data;
  },

  /**
   * Delete Variant Size
   */
  deleteVariantSize: async (sizeId: string) => {
    const response = await axiosInstance.delete<boolean>(
      `/shoes/variants/delete-size/${sizeId}`
    );
    return response.data;
  },

  /**
   * Get Purchased Items by Product
   * Endpoint: /shoes/products/purchased/by-product/{productId}
   */
  getPurchasedItems: async (
    productId: string,
    filters?: PurchasedItemFilters
  ) => {
    const queryParams = filters
      ? toQueryString({
          page: filters.page,
          size: filters.size,
        })
      : "";
    const response = await axiosInstance.get<PurchasedProductByProductPaginationResponse>(
      `/shoes/products/purchased/by-product/${productId}${queryParams}`
    );
    return response.data;
  },

  /**
   * Get Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order/{id}
   */
  getOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<OrderDetail>(
      `/shoes/products/order/${orderId}`
    );
    return response.data;
  },

  /**
   * Get Variant History
   */
  getVariantHistory: async (
    filters?: VariantHistoryFilters
  ) => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await axiosInstance.get<VariantHistoryPaginationResponse>(
      `/shoes/variants/history${queryParams}`
    );
    return response.data;
  },

  /**
   * Update Order Status
   */
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await axiosInstance.post<boolean>(
      `/shoes/variants/update-status?orderId=${orderId}&status=${status}`
    );
    return response.data;
  },
};
