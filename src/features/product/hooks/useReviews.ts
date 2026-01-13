"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createReview, getReviews, checkReviewEligibility } from "../services/review.api";
import { userQueryKeys } from "@/constants/userQueryKeys";
import {
  CreateProductReviewType,
  ProductReviewResponse,
  ProductReviewType,
  ReviewFilters,
} from "../types";
import { toast } from "sonner";
import { useAuthStore } from "@/store";

export function useReviews(filters: ReviewFilters) {
  return useQuery({
    queryKey: userQueryKeys.review.lists(filters.productId || "", filters.page || 1, filters.size || 10),
    queryFn: () => getReviews(filters),
    enabled: !!filters.productId,
    placeholderData: (previousData) => previousData,
  });
}

export function useCheckReviewEligibility(productId: string) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: [...userQueryKeys.review.key, "eligibility", productId, user?.id],
    queryFn: () => checkReviewEligibility(productId),
    enabled: !!productId && !!user,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review:  CreateProductReviewType ) => createReview(review),
    onSuccess: () => {
      // Invalidate tất cả queries có prefix ["review", productId] để refresh tất cả pages
      queryClient.invalidateQueries({
        queryKey: [...userQueryKeys.review.key, productId],
        exact: false,
      });
      toast.success("Gửi đánh giá thành công");
    },
    onError: () => {
      toast.error("Gửi đánh giá thất bại");
    },
  });
}
