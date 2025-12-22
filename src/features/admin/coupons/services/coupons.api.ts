import { apiClient } from "@/lib";
import { toQueryString } from "@/utils/queryString";
import { CouponPaginationResponse, CouponFilters, Coupon } from "../types";

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
  ): Promise<CouponPaginationResponse> => {
    const queryParams = filters
      ? toQueryString(filters)
      : "";
    const response = await apiClient.get<CouponPaginationResponse>(
      `/shoes/coupons/search${queryParams}`
    );
    return response.result;
  },

  /**
   * Save coupon (create or update)
   * Endpoint: /shoes/coupons/save
   */
  save: async (data: SaveCouponInput): Promise<Coupon> => {
    const response = await apiClient.post<Coupon>(
      `/shoes/coupons/save`,
      data
    );
    return response.result;
  },

  /**
   * Delete coupon
   * Endpoint: /shoes/coupons/delete/{id}
   */
  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      `/shoes/coupons/delete/${id}`
    );
    return response.result;
  },
};

