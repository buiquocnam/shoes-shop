"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "../services/payments.api";
import { PaymentFilters } from "../types";
import { adminQueryKeys } from "@/features/shared/constants/admin-queryKeys";
import { PaymentPaginationResponse } from "../types";

export const usePayments = (filters?: PaymentFilters) => {
  return useQuery<PaymentPaginationResponse, Error>({
    queryKey: [...adminQueryKeys.payments.key, "list", filters],
    queryFn: () => adminPaymentsApi.getAll(filters),
  });
};
