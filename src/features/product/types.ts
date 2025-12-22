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
  countProduct?: number;
}

// ===== IMAGE =====
export interface ImageType {
  fileName: string;
  url: string;
  isPrimary: boolean; 
}

// ===== PRODUCT IMAGE =====
export interface SizeType {
  id: string;
  size: string;
  stock: number;
  countSell: number;
}

// ===== PRODUCT VARIANT =====
export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  sizes: SizeType[];
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
  modifiedDate: string;
  countSell: number;
  averageRating: number;
  brand: BrandType;
  category: CategoryType;
  imageUrl: ImageType | null;
}

// ===== PRODUCT DETAIL =====
export interface ProductDetailType {
  product: ProductType;
  variants: ProductVariant[];
  listImg: ImageType[];
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
