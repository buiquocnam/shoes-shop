"use client";

import { checkoutApi } from "../services/checkout.api";
import {
  CreateOrderResponse,
  CheckoutItem,
} from "../types";
import { useMutationWithToast } from "@/features/shared";
import { useRouter } from "next/navigation";

export const useApplyDiscount = () => {
  return useMutationWithToast<
    { discount: number; discountCode: string },
    string
  >({
    mutationFn: (code: string) => checkoutApi.applyDiscountCode(code),
    successMessage: (data) =>
      `Áp dụng mã giảm giá thành công! Giảm ${data.discount}đ`,
    errorMessage: (error: any) =>
      error?.response?.data?.message || "Mã giảm giá không hợp lệ",
  });
};

export const useCreateOrder = () => {
  const router = useRouter();

  return useMutationWithToast<CreateOrderResponse, CheckoutItem[]>({
    mutationFn: (data: CheckoutItem[]) => checkoutApi.createOrder(data),
    onSuccess: () => {
      router.push(`/checkout/success`);
    },
    successMessage: "Đặt hàng thành công!",
    errorMessage: (error: any) =>
      error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.",
  });
};
