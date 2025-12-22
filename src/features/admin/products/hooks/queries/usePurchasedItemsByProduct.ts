"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import {
  PurchasedProductByProductPaginationResponse,
  PurchasedItemFilters,
} from "../../types";

export const usePurchasedItemsByProduct = (
  productId: string | null,
  filters?: PurchasedItemFilters
) => {
  return useQuery<PurchasedProductByProductPaginationResponse>({
    queryKey: [
      ...sharedQueryKeys.product.key,
      "purchased-items",
      productId || "",
      filters?.page || 1,
      filters?.limit || 10,
    ],
    queryFn: () => adminProductsApi.getPurchasedItems(productId!, filters),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
