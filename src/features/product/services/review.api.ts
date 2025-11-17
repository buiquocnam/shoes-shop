import { apiClient } from "@/lib/api";
import { CreateProductReviewType, ProductReviewResponse, ProductReviewType } from "../types";
import { ApiResponse } from "@/types/api";


export async function getReviews(productId: string): Promise<ProductReviewResponse> {
  try {
    const response = await apiClient.get<ProductReviewResponse>(`/shoes/reviews/get-by-product?product_id=${productId}`);
    return response.result as ProductReviewResponse;
  } catch (error) {
    // Nếu lỗi 404 (reviews không tìm thấy), trả về empty reviews
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        console.warn('⚠️ Reviews not found for product:', productId);
        return { data: [], currentPage: 1, pageSize: 10, totalElements: 0, totalPages: 0 } as ProductReviewResponse;
      }
    }
    // Với các lỗi khác, throw lại
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