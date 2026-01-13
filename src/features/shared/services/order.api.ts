import axiosInstance from "@/lib/axios";
import { OrderDetail } from "@/types/order";

export const orderApi = {
  /**
   * Get Order Detail by ID (for user/checkout success)
   * Endpoint: /shoes/products/order-detail/{id}
   */
  getOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<OrderDetail>(
      `/shoes/products/order-detail/${orderId}`
    );
    return response.data;
  },

  /**
   * Get Admin Order Detail by ID (for admin)
   * Endpoint: /shoes/products/order/{id}
   */
  getAdminOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<OrderDetail>(
      `/shoes/products/order/${orderId}`
    );
    return response.data;
  },
};
