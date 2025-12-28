"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import type {
  ProductFilters,
} from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: sharedQueryKeys.product.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useTopRatedProducts() {
  return useQuery({
    queryKey: sharedQueryKeys.product.topRated(),
    queryFn: () => productApi.getTopRatedProducts(),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
