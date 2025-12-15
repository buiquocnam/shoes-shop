"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../services/profile.api";
import { UpdateProfileRequest } from "../types";
import { toast } from "sonner";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKeys.profile.key, data);
      toast.success("Cập nhật profile thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Cập nhật profile thất bại"
      );
    },
  });
};

export const useProductsPurchased = () => {
  return useQuery({
    queryKey: userQueryKeys.profile.purchasedProducts(),
    queryFn: () => profileApi.productsPurchased(),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
