"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import type {
  ProductFilters,
} from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useTopRatedProducts() {
  return useQuery({
    queryKey: productQueryKeys.topRated(),
    queryFn: () => productApi.getTopRatedProducts(),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
