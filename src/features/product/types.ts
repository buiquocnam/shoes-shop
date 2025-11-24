import { PaginatedResponse, User } from "@/types/global";

// ===== CATEGORY =====
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  countProduct: number;
}

// ===== BRAND =====
export interface BrandType {
  id: string;
  name: string;
  logo?: string;
  createdDate?: string;
  modifiedDate?: string;
  productCount?: number;
}

// ===== IMAGE =====
export interface ImageType {
  fileName: string;
  url: string;
}

// ===== PRODUCT VARIANT =====
export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  countSell: number;
  stock: number;
  size: { label: string };
  sizeLabel?: string;
  createdDate: string;
  modifiedDate?: string;
}

// ===== PRODUCT =====
export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  totalStock: number;
  status: "ACTIVE" | "INACTIVE";
  createdDate: string;
  modifiedDate?: string;
  countSell: number;
  averageRating?: number;
  brand?: BrandType;
  category?: CategoryType;
  updated_at?: string;
  created_at?: string;
  imageUrl: ImageType | null;
}

// ===== PRODUCT DETAIL =====
export interface ProductDetailType {
  product: ProductType;
  listImg: ImageType[];
  variants: ProductVariant[];
}

// ===== PRODUCT REVIEW =====
export interface ProductReviewType {
  id: string;
  productId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  created: string;
}

export interface CreateProductReviewType {
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductReviewResponse
  extends PaginatedResponse<ProductReviewType> {}

// ===== PRODUCT FILTERS =====
export interface ProductFilters {
  page?: number;
  size?: number;
  category_id?: string;
  brand_id?: string;
  status?: "active" | "inactive";
  search?: string;
  name?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ===== PAGINATION =====
export interface ProductPaginationResponse
  extends PaginatedResponse<ProductType> {}
