"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "@/features/admin/products/services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

/**
 * Get Admin Order Detail by ID (for admin products)
 * Uses endpoint: /shoes/products/order/{id}
 */
export const useAdminOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: [...sharedQueryKeys.product.key, "admin-order", orderId || ""],
    queryFn: () => adminProductsApi.getOrderDetail(orderId!),
    enabled: !!orderId,
  });
};
