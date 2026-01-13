import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminBannersApi } from "../services/banners.api";
import { homeQueryKeys } from "@/features/home/constants/queryKeys";

export function useBanners() {
  return useQuery({
    queryKey: homeQueryKeys.banner.list(),
    queryFn: () => adminBannersApi.search(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}


export const useUpsertBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => adminBannersApi.createOrUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homeQueryKeys.banner.list(),
      });
      toast.success("Thành công");
    },
    onError: () => {
      toast.error("Thao tác thất bại");
    },
  });
};

