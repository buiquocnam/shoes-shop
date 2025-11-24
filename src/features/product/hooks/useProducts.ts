"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/product/services/product.api";
import { queryKeys } from "@/features/shared";
import type { ProductFilters, ProductPaginationResponse, ProductType } from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductPaginationResponse>({
    queryKey: queryKeys.product.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useTopRatedProducts() {
  return useQuery<ProductType[]>({
    queryKey: queryKeys.product.topRated(),
    queryFn: () => productApi.getTopRatedProducts(),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
} 