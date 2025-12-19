import { apiClient } from "@/lib/api";
import { OrderDetail } from "../types/order";

export const orderApi = {
  /**
   * Get Order Detail by ID
   */
  getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      `/shoes/products/order/${orderId}`
    );
    return response.result;
  },
};
