import { useQuery } from "@tanstack/react-query";
import { categoriesApi, brandsApi } from "@/features/shared/services";
import {
  CategoryType,
  BrandType,
  ProductDetailType,
  ProductPaginationResponse,
} from "@/features/product/types";
import { queryKeys } from "@/features/shared";
import { adminProductsApi } from "../../services/products.api";
import { AdminProductFilters } from "../../types";

export const useProductFormData = (enabled: boolean = true) => {
  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.shared.category.lists(),
    queryFn: categoriesApi.getAll,
    enabled,
  });

  const { data: brandsData } = useQuery({
    queryKey: queryKeys.shared.brand.lists(),
    queryFn: () => brandsApi.search(),
    enabled,
  });

  return {
    categories: (categoriesData || []) as CategoryType[],
    brands: (brandsData?.data || []) as BrandType[],
    isLoading: !categoriesData || !brandsData,
  };
};

export const useProducts = (filters?: AdminProductFilters) => {
  return useQuery<ProductPaginationResponse>({
    queryKey: queryKeys.product.list(filters),
    queryFn: () => adminProductsApi.getAll(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds - giữ data fresh trong 30s
  });
};

/**
 * Hook để fetch product detail by id
 * @param id - Product ID, chỉ fetch khi id có giá trị
 */
export const useProduct = (id: string) => {
  return useQuery<ProductDetailType>({
    queryKey: queryKeys.product.detail(id),
    queryFn: () => adminProductsApi.getById(id),
    enabled: !!id && id.length > 0,
  });
};
