"use client";

import { checkoutApi } from "../services/checkout.api";
import {
  CreateOrderResponse,
  CreateOrderRequest,
  CheckoutItem,
} from "../types/checkout";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AddressType } from "@/features/shared/types/address";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import {
  getCheckoutSource,
  clearCheckoutItems,
} from "../utils/checkoutStorage";
import { useQueryClient } from "@tanstack/react-query";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import { clearCart as clearCartApi } from "@/features/cart/services";

export const useCreateOrder = () => {
  const router = useRouter();
  const { clearCart: clearCartStore, setCart } = useCartStore();
  const queryClient = useQueryClient();

  return useMutation<
    CreateOrderResponse,
    any,
    {
      request: CreateOrderRequest;
      orderSummary: CheckoutItem[];
      selectedAddress: AddressType;
    }
  >({
    mutationFn: ({ request, selectedAddress }) => {
      if (!selectedAddress) {
        throw new Error("Vui lòng chọn địa chỉ giao hàng");
      }

      return checkoutApi.createOrder(request);
    },
    onSuccess: async (response, variables) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "checkoutSuccessData",
          JSON.stringify({
            orderSummary: variables.orderSummary,
            totalMoney: response.totalMoney,
            selectedAddress: variables.selectedAddress,
          })
        );

        const checkoutSource = getCheckoutSource();
        if (checkoutSource === "cart") {
            await clearCartApi();
            clearCartStore();
            setCart(null);
            queryClient.removeQueries({
              queryKey: userQueryKeys.cart.current(),
            });
            clearCheckoutItems();
        }
      }
      router.replace(`/checkout/success`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Đặt hàng thất bại. Vui lòng thử lại.";
      toast.error(message);
    },
  });
};
