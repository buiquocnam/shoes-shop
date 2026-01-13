"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "../services/payments.api";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";
import { PaymentRecord } from "../types";

export const usePaymentDetail = (paymentId: string | null) => {
  return useQuery<PaymentRecord, Error>({
    queryKey: [...adminQueryKeys.payments.key, "detail", paymentId || ""],
    queryFn: () => adminPaymentsApi.getDetail(paymentId!),
    enabled: !!paymentId,
  });
};