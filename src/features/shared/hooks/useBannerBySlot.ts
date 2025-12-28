import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { bannersApi } from "../services/banners.api";
import { BannerPaginationResponse } from "@/features/admin/banners/types";
import { sharedQueryKeys } from "../constants/shared-queryKeys";

export function useBanners(
  options?: Omit<UseQueryOptions<BannerPaginationResponse>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: sharedQueryKeys.banner.list(),
    queryFn: () => bannersApi.search(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

