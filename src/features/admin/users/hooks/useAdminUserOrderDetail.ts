"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { orderQueryKeys } from "@/features/order/constants/queryKeys";

/**
 * Get Admin Order Detail by ID (for admin users)
 * Uses endpoint: /shoes/products/order-detail/{id}
 */
export const useAdminUserOrderDetail = (orderId: string | null) => {
  return useQuery({
    queryKey: orderQueryKeys.adminUserDetail(orderId || ""),
    queryFn: () => adminUsersApi.getOrderDetail(orderId!),
    enabled: !!orderId,
  });
};
