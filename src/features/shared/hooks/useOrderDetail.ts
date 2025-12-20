"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../services/order.api";
import { sharedQueryKeys } from "../constants/shared-queryKeys";

/**
 * Get Order Detail by ID (for user/checkout success)
 * Uses endpoint: /shoes/products/order-detail/{id}
 */
export const useOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: [...sharedQueryKeys.product.key, "order-detail", orderId || ""],
    queryFn: () => orderApi.getOrderDetail(orderId!),
    enabled: !!orderId,
  });
};
