"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCouponsApi, SaveCouponInput } from "../services/coupons.api";
import { toast } from "sonner";
import { adminQueryKeys } from "@/features/admin/constants/queryKeys";

export const useSaveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveCouponInput) => adminCouponsApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.coupons.list() });
      toast.success("Lưu mã giảm giá thành công");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Không thể lưu mã giảm giá";
      toast.error(errorMessage);
    },
  });
};

