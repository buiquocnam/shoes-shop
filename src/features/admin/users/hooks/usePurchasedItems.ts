"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUsersApi } from "../services/users.api";
import { adminQueryKeys } from "@/features/shared";
import { PurchasedItem } from "@/features/profile/types";

export const usePurchasedItems = (userId: string | null) => {
  return useQuery<PurchasedItem[]>({
    queryKey: adminQueryKeys.users.purchasedItems(userId || ""),
    queryFn: () => adminUsersApi.getPurchasedItems(userId!),
    enabled: !!userId,
  });
};




