import axiosInstance from "@/lib/axios";
import { toQueryString } from "@/utils/queryString";
import { Payment, PaymentPaginationResponse, PaymentFilters } from "../types";

export const adminPaymentsApi = {
  /**
   * Get all payments with pagination
   */
  getAll: async (
    filters?: PaymentFilters
  ) => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await axiosInstance.get<PaymentPaginationResponse>(
      `/shoes/payment/get-all${queryParams}`
    );
    return response.data;
  },

  /**
   * Get payment detail by ID
   */
  getDetail: async (paymentId: string) => {
    const response = await axiosInstance.get<Payment>(
      `/shoes/payment/detail/${paymentId}`
    );
    return response.data;
  },
};
