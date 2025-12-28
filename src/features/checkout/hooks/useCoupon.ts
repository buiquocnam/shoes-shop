import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import { couponApi } from "../services/coupon.api";
import { Coupon, CouponListResponse } from "../types/coupon";

export const useCoupons = () => {
  return useQuery({
    queryKey: userQueryKeys.coupon.list(),
    queryFn: () => couponApi.getCouponList({ page: 1, size: 10, active: true }),
  });
};

export const useCouponByCode = (code: string) => {
  return useQuery({
    queryKey: userQueryKeys.coupon.get(code),
    queryFn: () => couponApi.getCouponByCode(code),
  });
};