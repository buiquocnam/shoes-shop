import { PaginatedResponse } from "@/types";
import { BrandType, CategoryType } from "@/features/product/types";

// Brand types
export interface FetchBrandsParams {
  page?: number;
  size?: number;
  sort_order?: "asc" | "desc";
}

export interface BrandPaginationResponse extends PaginatedResponse<BrandType> {}

// Category types
export interface FetchCategoriesParams {
  page?: number;
  size?: number;
  sort_order?: "asc" | "desc";
}

export interface CategoryPaginationResponse extends PaginatedResponse<CategoryType> {}

