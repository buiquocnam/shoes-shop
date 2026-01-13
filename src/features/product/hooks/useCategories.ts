import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";
import { productQueryKeys } from "../constants/queryKeys";
import { PaginatedResponse } from "@/types";

export function useCategories(
  options?: Omit<UseQueryOptions<PaginatedResponse<CategoryType>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productQueryKeys.category.list({ size: 100 }),
    queryFn: () => categoriesApi.getAll({ size: 100 }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
  });
}
