import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";
import { Filters } from "../types";
import { PaginatedResponse } from "@/types/global";

export function useCategories(
  filters?: Filters,
  options?: Omit<UseQueryOptions<PaginatedResponse<CategoryType>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: sharedQueryKeys.category.list(filters),
    queryFn: () => categoriesApi.getAll(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}
