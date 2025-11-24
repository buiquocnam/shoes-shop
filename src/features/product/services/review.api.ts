import { apiClient } from "@/lib/api";
import { CreateProductReviewType, ProductReviewResponse, ProductReviewType } from "../types";


export async function getReviews(productId: string): Promise<ProductReviewResponse> {
  try {
    const response = await apiClient.get<ProductReviewResponse>(`/shoes/reviews/get-by-product?product_id=${productId}`);
    return response.result as ProductReviewResponse;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        return { data: [], currentPage: 1, pageSize: 10, totalElements: 0, totalPages: 0 } as ProductReviewResponse;
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