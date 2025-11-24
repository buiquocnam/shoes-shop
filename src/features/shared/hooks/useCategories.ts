import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";
import { queryKeys } from "../constants/queryKeys";

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: queryKeys.shared.category.lists(),
    queryFn: categoriesApi.getAll,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}
