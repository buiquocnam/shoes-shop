import { apiClient } from "@/lib/api";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ShippingMethod,
} from "../types";

export const checkoutApi = {
  // Get available shipping methods
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    const response = await apiClient.get<ShippingMethod[]>(
      "/checkout/shipping-methods"
    );
    return response.result;
  },

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

  // Create order/checkout
  createOrder: async (data: CreateOrderRequest[]): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      data
    );
    return response.result;
  },

};






