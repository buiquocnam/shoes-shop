import axiosInstance from "@/lib/axios";
import { Coupon, CouponListResponse } from "../types/coupon";
import { CouponFilters } from "../types/coupon";
import { toQueryString } from "@/utils/queryString";


export const couponApi = {
  getCouponByCode: async (code: string) => {
    const response = await axiosInstance.get<Coupon>(`/shoes/coupons/get-by-code/${code}`);
    return response.data;
  },

  getCouponList: async (filters?: CouponFilters) => {
    const response = await axiosInstance.get<CouponListResponse>(`/shoes/coupons/search${toQueryString(filters)}`);
    return response.data;
  },
};