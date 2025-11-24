"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviews } from "../services/review.api";
import { queryKeys, useMutationWithToast } from "@/features/shared";
import {
  CreateProductReviewType,
  ProductReviewResponse,
  ProductReviewType,
} from "../types";

export function useReviews(productId: string) {
  return useQuery<ProductReviewResponse>({
    queryKey: queryKeys.review.lists(productId),
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
        queryKey: queryKeys.review.lists(productId),
      });
    },
    successMessage: "Review submitted successfully",
    errorMessage: "Failed to submit review",
  });
}
