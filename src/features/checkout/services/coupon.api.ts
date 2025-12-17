import { apiClient } from "@/lib";
import { Coupon, CouponListResponse } from "../types/coupon";
import { CouponFilters } from "../types/coupon";
import { toQueryString } from "@/utils/queryString";
export const couponApi = {
  getCouponByCode: async (code: string): Promise<Coupon> => {
    const response = await apiClient.get<Coupon>(`/shoes/coupons/get-by-code/${code}`);
    return response.result;
  },

  getCouponList: async (filters?: CouponFilters): Promise<CouponListResponse> => {
    const response = await apiClient.get<CouponListResponse>(`/shoes/coupons/search${toQueryString(filters)}`);
    return response.result;
  },
};