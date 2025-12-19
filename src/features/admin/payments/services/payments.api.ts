import { apiClient } from "@/lib";
import { toQueryString } from "@/utils/queryString";
import { Payment, PaymentPaginationResponse, PaymentFilters } from "../types";

export const adminPaymentsApi = {
  /**
   * Get all payments with pagination
   */
  getAll: async (
    filters?: PaymentFilters
  ): Promise<PaymentPaginationResponse> => {
    const queryParams = filters ? toQueryString(filters) : "";
    const response = await apiClient.get<PaymentPaginationResponse>(
      `/shoes/payment/get-all${queryParams}`
    );
    return response.result;
  },

  /**
   * Get payment detail by ID
   */
  getDetail: async (paymentId: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(
      `/shoes/payment/detail/${paymentId}`
    );
    return response.result;
  },
};
