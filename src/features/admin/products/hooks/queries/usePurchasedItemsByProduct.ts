"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { PaginationParams } from "@/types/common";

export const usePurchasedItemsByProduct = (
  productId: string | null,
  filters?: PaginationParams
) => {
  return useQuery({
    queryKey: [
      ...sharedQueryKeys.product.key,
      "purchased-items",
      productId || "",
      filters?.page || 1,
      filters?.size || 10,
    ],
    queryFn: () => adminProductsApi.getPurchasedItems(productId!, filters),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
