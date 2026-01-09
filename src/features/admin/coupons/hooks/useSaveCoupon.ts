"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCouponsApi, SaveCouponInput } from "../services/coupons.api";
import { Coupon } from "@/types/coupon";
import { toast } from "sonner";

export const useSaveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveCouponInput) => adminCouponsApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons", "list"] });
      toast.success("Lưu mã giảm giá thành công");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Không thể lưu mã giảm giá";
      toast.error(errorMessage);
    },
  });
};

