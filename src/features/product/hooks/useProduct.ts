"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { queryKeys } from "@/features/shared";
import type { ProductDetailType } from "../types";

export function useProduct(productId: string) {
  return useQuery<ProductDetailType>({
    queryKey: queryKeys.product.detail(productId),
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
