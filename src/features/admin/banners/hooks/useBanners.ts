import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminBannersApi } from "../services/banners.api";
import {
  BannerType,
  FetchBannersParams,
  BannerPaginationResponse,
} from "../types";

const BANNER_QUERY_KEYS = {
  all: ["banners"] as const,
  lists: () => [...BANNER_QUERY_KEYS.all, "list"] as const,
  list: (filters?: FetchBannersParams) =>
    [...BANNER_QUERY_KEYS.lists(), filters] as const,
} as const;

export function useBanners(
  filters?: FetchBannersParams,
  options?: Omit<
    UseQueryOptions<BannerPaginationResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: BANNER_QUERY_KEYS.list(filters),
    queryFn: () => adminBannersApi.search(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}


export const useUpsertBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => adminBannersApi.createOrUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BANNER_QUERY_KEYS.all,
      });
      toast.success("Thành công");
    },
    onError: () => {
      toast.error("Thao tác thất bại");
    },
  });
};

