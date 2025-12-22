import { PaginatedResponse, PaginationParams } from "@/types/global";

/**
 * Coupon Type
 */
export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  quantity: number;
  expirationDate: string;
  active: boolean;
  createdDate: string;
  modifiedDate: string;
}

/**
 * Coupon Pagination Response
 */
export interface CouponPaginationResponse extends PaginatedResponse<Coupon> {}

/**
 * Coupon Filters
 */
export interface CouponFilters extends PaginationParams {
  code?: string;
  active?: boolean;
}

