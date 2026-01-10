"use client";

import { checkoutApi, VnPayPaymentRequest } from "../services/checkout.api";
import { CreateOrderResponse, CreateOrderRequest } from "../types/checkout";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCheckoutStore } from '@/store';
import { useQueryClient } from "@tanstack/react-query";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const checkoutSource = useCheckoutStore((state) => state.source);
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  return useMutation({
    mutationFn: ({ request }: { request: CreateOrderRequest }) => {
      return checkoutApi.createOrder(request);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Đặt hàng thất bại. Vui lòng thử lại."
      );
    },
  });
};

export const useVnPayPayment = () => {
  return useMutation({
    mutationFn: (request: VnPayPaymentRequest) => {
      return checkoutApi.createVnPayPayment(request);
    },
    onSuccess: (response) => {
      if (response.message === "success") {
        window.location.href = response.paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      }
    },
    onError: (error: any) => {
      const message =
        error?.message || "Tạo link thanh toán thất bại. Vui lòng thử lại.";
      toast.error(message);
    },
  });
};
