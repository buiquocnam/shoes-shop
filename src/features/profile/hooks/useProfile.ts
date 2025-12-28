"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../services/profile.api";
import {
  UpdateProfileRequest,
  PurchasedItemFilters,
  PurchasedListPaginationResponse,
} from "../types";
import { toast } from "sonner";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import { useAuthStore } from "@/store";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile.key });
      toast.success("Cập nhật profile thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Cập nhật profile thất bại"
      );
    },
  });
};

export const useProductsPurchased = (filters?: PurchasedItemFilters) => {
  return useQuery({
    queryKey: userQueryKeys.profile.purchasedProducts(filters),
    queryFn: () => profileApi.productsPurchased(filters),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
