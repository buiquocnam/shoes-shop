import { apiClient } from "@/lib/api";
import { ProductType, ProductDetailType } from "@/features/product/types";
import { PurchasedItem } from "@/features/profile/types";

export interface CreateProductInput {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  discount: number;
  slug?: string;
}

export interface UpdateProductInfoInput {
  productId: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  discount: number;
  slug?: string;
}

export interface CreateVariantInput {
  productId: string;
  color: string;
  sizes: Array<{ size: number }>;
}

export interface CreateVariantsInput {
  productId: string;
  variants: Array<{
    id?: string;
    color: string;
    sizes: Array<{ id?: string; size: number }>;
  }>;
}

export interface UpsertVariantsInput {
  productId: string;
  variants: Array<{
    id?: string; // Có id → UPDATE, không có id → CREATE
    color: string;
    sizes: Array<{
      id?: string; // Có id → UPDATE size, không có id → CREATE size
      size: number;
      stock?: number; // Stock có thể gửi trong upsert (optional)
    }>;
  }>;
}

/**
 * Response từ upsert variants API
 * Trả về array flat của variant sizes (không phải nested)
 */
export interface UpsertVariantSizeResponse {
  id: string; // variantSizeId
  productId: string;
  stock: number;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  countSell: number;
  size: string; // size value
}

export type UpsertVariantsResponse = UpsertVariantSizeResponse[];

export interface UpdateVariantInput {
  variantId: string;
  color: string;
  sizes: Array<{ id?: string; size: number }>;
}

export interface ImportStockInput {
  productId: string;
  items: Array<{
    variantSizeId: string;
    count: number;
  }>;
}

export interface UpdateImagesInput {
  productId: string;
  imageNames: string[];
  primaryName: string;
}

export interface VariantResponse {
  id: string;
  color: string;
  sizes: Array<{ id: string; size: number }>;
}

export const adminProductsApi = {
  /**
   * Create Product
   * Payload: FormData với JSON body (info) + multipart files (images)
   */
  create: async (data: FormData): Promise<{ id: string }> => {
    const response = await apiClient.post<{ id: string }>(
      "/shoes/products/create-product",
      data
    );
    return response.result;
  },

  /**
   * Update Product Info
   * Chỉ update info, không xử lý variant hoặc image
   */
  updateInfo: async (data: UpdateProductInfoInput): Promise<ProductType> => {
    const response = await apiClient.patch<ProductType>(
      `/shoes/products/update/content`,
      data
    );
    return response.result;
  },

  deleteVariant: async (variantId: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/variants/delete/${variantId}`
    );
    return response.result;
  },

  /**
   * Get Product by ID
   */
  getById: async (id: string): Promise<ProductDetailType> => {
    const response = await apiClient.get<ProductDetailType>(
      `/shoes/products/get-by-id/${id}`
    );
    return response.result;
  },

  /**
   * Upsert Variants
   * Gọi một lần để CREATE/UPDATE nhiều variants
   * Có id → UPDATE, không có id → CREATE
   */
  upsertVariants: async (
    data: UpsertVariantsInput
  ): Promise<UpsertVariantsResponse> => {
    const response = await apiClient.post<UpsertVariantsResponse>(
      `/shoes/variants/upsert`,
      {
        productId: data.productId,
        variants: data.variants.map((variant) => ({
          id: variant.id,
          color: variant.color,
          sizes: variant.sizes.map((size) => ({
            id: size.id,
            size: size.size,
          })),
        })),
      }
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
   * Get Purchased Items by Product
   */
  getPurchasedItems: async (productId: string): Promise<PurchasedItem[]> => {
    const response = await apiClient.get<PurchasedItem[]>(
      `/shoes/products/purchased/by-product/${productId}`
    );
    return response.result;
  },
};
