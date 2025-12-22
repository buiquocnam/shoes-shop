"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { VariantHistoryFilters } from "../../types";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";

export const useVariantHistory = (filters?: VariantHistoryFilters) => {
  return useQuery({
    queryKey: [
      ...sharedQueryKeys.product.key,
      "variant-history",
      filters?.page || 1,
      filters?.size || 10,
      filters?.productId || "",
      filters?.variantId || "",
    ],
    queryFn: () => adminProductsApi.getVariantHistory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
