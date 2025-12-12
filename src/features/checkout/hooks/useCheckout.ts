"use client";

import { checkoutApi } from "../services/checkout.api";
import {
  CreateOrderResponse,
  CreateOrderRequest,
  CheckoutItem,
} from "../types";
import { useMutationWithToast } from "@/features/shared";
import { useRouter } from "next/navigation";
import { AddressType } from "@/features/shared/types/address";

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

  return useMutationWithToast<
    CreateOrderResponse,
    {
      request: CreateOrderRequest;
      orderSummary: CheckoutItem[];
      selectedAddress: AddressType; // Required - không được null
    }
  >({
    mutationFn: ({ request, selectedAddress }) => {
      // Validate: address phải có
      if (!selectedAddress) {
        throw new Error("Vui lòng chọn địa chỉ giao hàng");
      }

      return checkoutApi.createOrder(request);
    },
    onSuccess: (response, variables) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "checkoutSuccessData",
          JSON.stringify({
            orderSummary: variables.orderSummary,
            totalMoney: response.totalMoney,
            selectedAddress: variables.selectedAddress,
          })
        );
      }
      // Dùng replace thay vì push để navigate ngay, tránh flash giao diện checkout
      router.replace(`/checkout/success`);
    },
    successMessage: "Đặt hàng thành công!",
    errorMessage: (error: any) =>
      error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.",
  });
};
