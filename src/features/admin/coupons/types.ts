import { PaginationParams } from "@/types";

export interface CouponFilters extends PaginationParams {
  code?: string;
  active?: boolean;
}

