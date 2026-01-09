import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import { CouponPaginationResponse, CouponFilters, Coupon } from "@/types/coupon";

export interface SaveCouponInput {
  id?: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  quantity: number;
  expirationDate: string;
  active: boolean;
}

export const adminCouponsApi = {
  /**
   * Search coupons with filters
   * Endpoint: /shoes/coupons/search
   */
  search: async (
    filters?: CouponFilters
  ) => {
    const queryParams = filters
      ? toQueryString(filters)
      : "";
    const response = await axiosInstance.get<CouponPaginationResponse>(
      `/shoes/coupons/search${queryParams}`
    );
    return response.data;
  },

  /**
   * Save coupon (create or update)
   * Endpoint: /shoes/coupons/save
   */
  save: async (data: SaveCouponInput) => {
    const response = await axiosInstance.post<Coupon>(
      `/shoes/coupons/save`,
      data
    );
    return response.data;
  },

  /**
   * Delete coupon
   * Endpoint: /shoes/coupons/delete/{id}
   */
  delete: async (id: string) => {
    const response = await axiosInstance.delete<boolean>(
      `/shoes/coupons/delete/${id}`
    );
    return response.data;
  },
};

