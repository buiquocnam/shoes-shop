import { apiClient } from "@/lib/api";
import { CreateOrderResponse, CreateOrderRequest } from "../types/checkout";

export interface VnPayPaymentRequest {
  amount: number;
  bankCode?: string;
  variantSizeId: string;
}

export interface VnPayPaymentResponse {
    code: string;
    message: string;
    paymentUrl: string;
    amount: null;
    bankCode: null;
    userId: null;
}

export const checkoutApi = {

  createOrder: async (
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      request
    );
    
    if (!response.result) {
      throw new Error("API response result is undefined");
    }
    
    // Validate that orderId exists in response
    if (!response.result.orderId) {
      throw new Error("Order ID is missing from API response");
    }
    
    return response.result;
  },

  createVnPayPayment: async (
    request: VnPayPaymentRequest
  ): Promise<VnPayPaymentResponse> => {
    const { amount, variantSizeId, bankCode = "NCB" } = request;
    const params = new URLSearchParams({
      amount: amount.toString(),
      bankCode,
      variantSizeId,
    });

    const response = await apiClient.get<VnPayPaymentResponse>(
      `/shoes/payment/vn-pay?${params.toString()}`
    );
    return response.result;
  },
};
