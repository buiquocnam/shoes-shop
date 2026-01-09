"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCouponsApi } from "../services/coupons.api";
import { CouponFilters, CouponPaginationResponse } from "@/types/coupon";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";

/**
 * Get coupons with filters
 */
export const useCoupons = (filters?: CouponFilters) => {
  return useQuery({
    queryKey: ["admin", "coupons", "list", filters],
    queryFn: () => adminCouponsApi.search(filters),
  });
};

