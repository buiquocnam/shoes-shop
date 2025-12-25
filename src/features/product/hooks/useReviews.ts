"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createReview, getReviews } from "../services/review.api";
import { userQueryKeys } from "@/features/shared/constants/user-queryKeys";
import {
  CreateProductReviewType,
  ProductReviewResponse,
  ProductReviewType,
  ReviewFilters,
} from "../types";
import { toast } from "sonner";

export function useReviews(filters: ReviewFilters) {
  return useQuery<ProductReviewResponse>({
    queryKey: userQueryKeys.review.lists(filters.productId || "", filters.page || 1, filters.size || 10),
    queryFn: () => getReviews(filters),
    enabled: !!filters.productId,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation<ProductReviewType, Error, CreateProductReviewType>({
    mutationFn: (review) => createReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.review.lists(productId),
      });
      toast.success("Gửi đánh giá thành công");
    },
    onError: () => {
      toast.error("Gửi đánh giá thất bại");
    },
  });
}
