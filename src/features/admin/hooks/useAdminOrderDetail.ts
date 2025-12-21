"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/features/shared/services/order.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

/**
 * Get Admin Order Detail by ID (for admin)
 * Uses endpoint: /shoes/products/order/{id}
 */
export const useAdminOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: [...sharedQueryKeys.product.key, "admin-order", orderId || ""],
    queryFn: () => orderApi.getAdminOrderDetail(orderId!),
    enabled: !!orderId,
  });
};


