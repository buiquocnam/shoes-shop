import { ProductType } from "@/features/product/types";

export interface ProductContentInput {
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  categoryId: string;
  brandId: string;
  primaryName: string;
}

export interface AdminProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  status?: "ACTIVE" | "INACTIVE";
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateVariantsInput {
  productId: string;
  variants: Array<{
    color: string;
    size: string;
  }>;
}

export interface ImportStockInput {
  productId: string;
  items: Array<{
    variantId: string;
    count: number;
  }>;
}

export interface UpdateVariantInput {
  id: string;
  color: string;
  size: string;
}
