import { BaseEntity, PaginatedResponse, PaginationParams } from "./common";

export interface Coupon extends BaseEntity {
  code: string;
  discountPercent: number;
  minOrder: number;
  quantity: number;
  expirationDate: string;
  active: boolean;
}

export interface CouponFilters extends PaginationParams {
  code?: string;
  active?: boolean;
}

export type CouponPaginationResponse = PaginatedResponse<Coupon>;
