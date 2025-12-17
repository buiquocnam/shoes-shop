import { PaginatedResponse } from "@/types/global";

export interface CouponFilters {
  page: number;
  size: number;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  quantity: number;
  expirationDate: Date;
  active: boolean;
  createdDate: Date;
  modifiedDate: Date;
}

export interface CouponListResponse extends PaginatedResponse<Coupon> {
    data: Coupon[];
}