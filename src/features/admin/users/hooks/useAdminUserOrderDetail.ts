"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

/**
 * Get Admin Order Detail by ID (for admin users)
 * Uses endpoint: /shoes/products/order-detail/{id}
 */
export const useAdminUserOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: [...sharedQueryKeys.product.key, "admin-user-order", orderId || ""],
    queryFn: () => adminUsersApi.getOrderDetail(orderId!),
    enabled: !!orderId,
  });
};
