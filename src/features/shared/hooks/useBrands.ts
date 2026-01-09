import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { brandsApi } from "../services/brands.api";
import { BrandPaginationResponse, FetchBrandsParams } from "../types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";

export function useBrands(
  filters?: FetchBrandsParams,
  options?: Omit<
    UseQueryOptions<BrandPaginationResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sharedQueryKeys.brand.list(filters),
    queryFn: () => brandsApi.search(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
  });
}
