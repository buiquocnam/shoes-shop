import axiosInstance from "@/lib/axios";
import { CreateOrderResponse, CreateOrderRequest } from "../types/checkout";

export interface VnPayPaymentRequest {
  amount: number;
  bankCode?: string;
  orderId: string;
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
  ) => {
    const response = await axiosInstance.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      request
    );
    
    const order = response.data;
    
    if (!order) {
      throw new Error("API response result is undefined");
    }
    
    // Validate that orderId exists in response
    if (!order.orderId) {
      throw new Error("Order ID is missing from API response");
    }
    
    return order;
  },

  createVnPayPayment: async (
    request: VnPayPaymentRequest
  ) => {
    const { amount, orderId, bankCode = "NCB" } = request;
    const params = new URLSearchParams({
      amount: amount.toString(),
      bankCode,
      orderId,
    });

    const response = await axiosInstance.get<VnPayPaymentResponse>(
      `/shoes/payment/vn-pay?${params.toString()}`
    );
    return response.data;
  },
};
