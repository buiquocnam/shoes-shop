"use client";

import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import type {
  ProductFilters,
  ProductPaginationResponse,
  ProductType,
} from "../types";

export function useProducts(filters?: ProductFilters) {
  return useSuspenseQuery<ProductPaginationResponse>({
    queryKey: sharedQueryKeys.product.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 60 * 1000,
  });
}

export function useTopRatedProducts() {
  return useQuery<ProductType[]>({
    queryKey: sharedQueryKeys.product.topRated(),
    queryFn: () => productApi.getTopRatedProducts(),
    staleTime: 60 * 1000,
    placeholderData: (previousData: ProductType[] | undefined) => previousData,
  });
}
