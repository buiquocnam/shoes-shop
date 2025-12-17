import { apiClient } from "@/lib/api";
import {
  CreateOrderResponse,
  CreateOrderRequest,
} from "../types/checkout";

export const checkoutApi = {

  createOrder: async (
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>(
      "/shoes/variants/buy",
      request
    );
    return response.result;
  },
};
