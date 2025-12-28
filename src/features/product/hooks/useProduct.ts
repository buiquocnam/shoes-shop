"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import type { ProductDetailType } from "../types";

export function useProduct(productId: string) {
  return useQuery({
    queryKey: sharedQueryKeys.product.detail(productId),
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
