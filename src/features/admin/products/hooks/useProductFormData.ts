import { useQuery } from "@tanstack/react-query";
import { categoriesApi, brandsApi } from "@/features/shared/services";
import { CategoryType, BrandType } from "@/features/product/types";
import { queryKeys } from "@/features/shared";

export const useProductFormData = () => {
  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.shared.category.lists(),
    queryFn: categoriesApi.getAll,
  });

  const { data: brandsData } = useQuery({
    queryKey: queryKeys.shared.brand.lists(),
    queryFn: () => brandsApi.search(),
  });

  return {
    categories: (categoriesData || []) as CategoryType[],
    brands: (brandsData?.data || []) as BrandType[],
    isLoading: !categoriesData || !brandsData,
  };
};
