import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: sharedQueryKeys.category.lists(),
    queryFn: categoriesApi.getAll,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}
