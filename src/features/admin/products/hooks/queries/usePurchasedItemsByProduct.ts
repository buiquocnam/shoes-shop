"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { PurchasedItem } from "@/features/profile/types";

export const usePurchasedItemsByProduct = (productId: string | null) => {
  return useQuery<PurchasedItem[]>({
    queryKey: [
      ...sharedQueryKeys.product.key,
      "purchased-items",
      productId || "",
    ],
    queryFn: () => adminProductsApi.getPurchasedItems(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

