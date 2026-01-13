"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "../services/payments.api";
import { adminQueryKeys } from "@/features/admin/constants/queryKeys";
import { PaymentRecord } from "../types";

export const usePaymentDetail = (paymentId: string | null) => {
  return useQuery<PaymentRecord, Error>({
    queryKey: adminQueryKeys.payments.detail(paymentId || ""),
    queryFn: () => adminPaymentsApi.getDetail(paymentId!),
    enabled: !!paymentId,
  });
};