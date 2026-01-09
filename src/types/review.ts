import { BaseEntity, PaginatedResponse } from "./common";
import { User } from "./user";

export interface Review extends BaseEntity {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  user: User;
}

export interface CreateProductReviewType {
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewFilters {
  page?: number;
  size?: number;
  productId?: string;
}

export interface ProductReviewResponse extends PaginatedResponse<Review> {}
