"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "@/features/admin/products/services/products.api";
import { orderQueryKeys } from "@/features/order/constants/queryKeys";

/**
 * Get Admin Order Detail by ID (for admin products)
 * Uses endpoint: /shoes/products/order/{id}
 */
export const useAdminOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: orderQueryKeys.adminDetail(orderId || ""),
    queryFn: () => adminProductsApi.getOrderDetail(orderId!),
    enabled: !!orderId,
  });
};
