import { apiClient } from "@/lib/api";
import { CreateProductReviewType, ProductReviewResponse, ProductReviewType, ReviewFilters } from "../types";
import { toQueryString } from "@/utils/queryString";


export async function getReviews(filters: ReviewFilters): Promise<ProductReviewResponse> {
  try {
    // Convert productId to product_id for API
    const apiFilters = {
      page: filters.page,
      size: filters.size,
      product_id: filters.productId,
    };
    const response = await apiClient.get<ProductReviewResponse>(`/shoes/reviews/get-by-product${toQueryString(apiFilters)}`);
    return response.result as ProductReviewResponse;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        return { data: [], currentPage: 1, pageSize: filters.size || 10, totalElements: 0, totalPages: 0 } as ProductReviewResponse;
      }
    }
    throw error;
  }
}


export async function createReview(review: CreateProductReviewType): Promise<ProductReviewType> {
  try {
    const response = await apiClient.post<ProductReviewType>('/shoes/reviews', review);
    return response.result;
  } catch (error) {
    throw error;
  }
}