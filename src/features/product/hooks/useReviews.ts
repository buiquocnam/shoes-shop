"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviews } from "../services/review.api";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import { useMutationWithToast } from "@/features/shared";
import {
  CreateProductReviewType,
  ProductReviewResponse,
  ProductReviewType,
} from "../types";

export function useReviews(productId: string) {
  return useQuery<ProductReviewResponse>({
    queryKey: userQueryKeys.review.lists(productId),
    queryFn: () => getReviews(productId),
    enabled: !!productId,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutationWithToast<ProductReviewType, CreateProductReviewType>({
    mutationFn: (review) => createReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.review.lists(productId),
      });
    },
    successMessage: "Review submitted successfully",
    errorMessage: "Failed to submit review",
  });
}
