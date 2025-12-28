"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "../services/payments.api";
import { PaymentFilters, PaymentPaginationResponse } from "../types";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";

/**
 * Get all payments with filters
 */
export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: [...adminQueryKeys.payments.key, "list", filters],
    queryFn: () => adminPaymentsApi.getAll(filters),
  });
};
