import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";
import { Filters } from "../types";

export function useCategories(filters?: Filters) {
  return useQuery<CategoryType[]>({
    queryKey: sharedQueryKeys.category.list(),
    queryFn: () => categoriesApi.getAll(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}
