import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "../services/brands.api";
import { BrandPaginationResponse, FetchBrandsParams } from "../types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";

export function useBrands(filters?: FetchBrandsParams) {
  return useQuery<BrandPaginationResponse>({
    queryKey: sharedQueryKeys.brand.lists(filters),
    queryFn: () => brandsApi.search(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
}
