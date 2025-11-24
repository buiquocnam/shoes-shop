"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../services/profile.api";
import { UpdateProfileRequest } from "../types";
import { toast } from "sonner";
import { queryKeys } from "@/features/shared";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.all, data);
      toast.success("Cập nhật profile thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Cập nhật profile thất bại"
      );
    },
  });
};

export const useProductsPurchased = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.profile.purchasedProducts(userId),
    queryFn: () => profileApi.productsPurchased(userId),
    enabled: !!userId,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
