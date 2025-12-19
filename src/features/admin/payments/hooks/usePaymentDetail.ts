"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "../services/payments.api";
import { Payment } from "../types";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";

/**
 * Get payment detail by ID
 */
export const usePaymentDetail = (paymentId: string | null) => {
  return useQuery<Payment>({
    queryKey: [...adminQueryKeys.payments.key, "detail", paymentId || ""],
    queryFn: () => adminPaymentsApi.getDetail(paymentId!),
    enabled: !!paymentId,
  });
};
