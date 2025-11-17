import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "../services/brands.api";
import { BrandPaginationResponse, FetchBrandsParams } from "../types";

export function useBrands(filters?: FetchBrandsParams) {
  return useQuery<BrandPaginationResponse>({
    queryKey: ['brands', filters],
    queryFn: () => brandsApi.search(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}

