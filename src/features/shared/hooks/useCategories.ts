import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";
import { CategoryType } from "@/features/product/types";

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}
