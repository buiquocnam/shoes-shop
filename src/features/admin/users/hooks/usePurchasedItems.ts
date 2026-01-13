"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../services/users.api";
import { adminQueryKeys } from "@/features/admin/constants/queryKeys";
import {
  PurchasedItemFilters,
} from "@/features/profile/types";

export const usePurchasedItems = (
  userId: string | null,
  filters?: PurchasedItemFilters
) => {
  return useQuery({
    queryKey: adminQueryKeys.users.purchasedItems(
      userId || "",
      filters?.page || 1,
      filters?.size || 10
    ),
    queryFn: () => adminUsersApi.getPurchasedItems(userId!, filters),
    enabled: !!userId,
  });
};
