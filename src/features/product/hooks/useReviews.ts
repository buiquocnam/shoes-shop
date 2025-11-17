import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviews } from "../services/review.api";
import { CreateProductReviewType, ProductReviewResponse, ProductReviewType } from "../types";

export function useReviews(productId: string) {
  return useQuery<ProductReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews(productId),
    placeholderData: (previousData) => previousData, 

  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation<ProductReviewType, Error, CreateProductReviewType>({
    mutationFn: (review) => createReview(review),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (error) => {
      console.error('Create review error:', error);
    },
  });
}