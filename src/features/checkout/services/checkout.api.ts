import { apiClient } from "@/lib/api";
import { CheckoutItem, OrderItem, CreateOrderResponse, CreateOrderRequest } from "../types";
import { convertCheckoutItemsToApiFormat } from "../utils/checkoutHelpers";

export const checkoutApi = {
  // Apply discount code
  applyDiscountCode: async (
    code: string
  ): Promise<{ discount: number; discountCode: string }> => {
    const response = await apiClient.post<{
      discount: number;
      discountCode: string;
    }>("/checkout/apply-discount", { code });
    return response.result;
  },

  // Create order/checkout - convert CheckoutItem sang API format trước khi gửi
  createOrder: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      request
    );
    return response.result;
  },
};
