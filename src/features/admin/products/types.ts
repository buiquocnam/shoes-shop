import { PaginatedResponse, User } from "@/types";
import { Product } from "@/types/product";
import { Variant } from "@/types/variant";

// ===== PRODUCT INPUT TYPES =====
export interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateProductInfoInput {
  productId: string;
  name?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  status?: "ACTIVE" | "INACTIVE";
}

// ===== VARIANT INPUT TYPES =====
export interface VariantInput {
  variantId?: string;
  color: string;
  sizes: {
    sizeId?: string;
    size: string;
    stock?: number;
  }[];
}

export interface UpsertVariantsInput {
  productId: string;
  variants: VariantInput[];
}

export interface ImportStockInput {
  productId: string;
  items: {
    variantSizeId: string;
    count: number;
  }[];
}

// ===== VARIANT RESPONSE TYPES =====
export interface VariantResponse {
  id: string;
  productId: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  sizes: {
    id: string;
    variantId: string;
    size: string;
    stock: number;
  }[];
}

// ===== VARIANT HISTORY TYPES =====
export interface VariantHistoryItem {
  id: string;
  product: Product;
  color: string;
  size: string;
  count: number;
  oldStock: number;
  variantId?: string;
  variant: {
    id: string;
    productId: string;
    stock: number;
    color: string;
    status: "ACTIVE" | "INACTIVE";
    countSell: number;
    size: string;
  };
  date: string;
}

export interface VariantHistoryFilters {
  page?: number;
  size?: number;
  productId?: string;
  variantId?: string;
  name?: string;
}

export interface VariantHistoryPaginationResponse
  extends PaginatedResponse<VariantHistoryItem> {}

// ===== PURCHASED PRODUCT BY PRODUCT TYPES =====
export interface PurchasedProductByProduct {
  id: string;
  product: Product;
  variant: Variant & { size: string; countSell: number; stock: number }; // Extended variant info often returned in stats
  countBuy: number;
  totalMoney: number;
  userId: string;
  user: User;
}

export interface PurchasedProductByProductPaginationResponse
  extends PaginatedResponse<PurchasedProductByProduct> {}
