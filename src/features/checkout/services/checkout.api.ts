import { apiClient } from "@/lib/api";
import {
  CheckoutItem,
  CheckoutItemApiRequest,
  CreateOrderResponse,
} from "../types";
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
  createOrder: async (items: CheckoutItem[]): Promise<CreateOrderResponse> => {
    const apiData: CheckoutItemApiRequest[] = convertCheckoutItemsToApiFormat(items);
    const response = await apiClient.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      apiData
    );
    return response.result;
  },
};






