"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCouponsApi } from "../services/coupons.api";
import { toast } from "sonner";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id: string) => adminCouponsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.coupons.key, "list"] });
      toast.success("Xóa mã giảm giá thành công");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Không thể xóa mã giảm giá";
      toast.error(errorMessage);
    },
  });
};

