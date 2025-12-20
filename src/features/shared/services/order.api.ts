import { apiClient } from "@/lib/api";
import { OrderDetail } from "../types/order";

export const orderApi = {
  /**
   * Get Order Detail by ID (for user/checkout success)
   * Endpoint: /shoes/products/order-detail/{id}
   */
  getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      `/shoes/products/order-detail/${orderId}`
    );
    return response.result;
  },

  /**
   * Get Admin Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order/{id}
   */
  getAdminOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      `/shoes/products/order/${orderId}`
    );
    return response.result;
  },
};
