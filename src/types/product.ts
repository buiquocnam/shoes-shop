import { BaseEntity, ProductStatus, ImageType, PaginatedResponse } from "./common";
import { Category } from "./category";
import { Brand } from "./brand";

export interface Product extends BaseEntity {
  category: Category;
  brand: Brand;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  totalStock: number;
  status: ProductStatus;
  averageRating: number;
  countSell: number;
  imageUrl: ImageType | null; 
}

export interface ProductDetail {
  product: Product;
  variants: import("./variant").Variant[];
  listImg: ImageType[];
}

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

export interface ProductPaginationResponse extends PaginatedResponse<Product> {}
