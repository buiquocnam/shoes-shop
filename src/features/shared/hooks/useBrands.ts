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
  return useQuery<BrandPaginationResponse>({
    queryKey: sharedQueryKeys.brand.list(),
    queryFn: () => brandsApi.search(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}
