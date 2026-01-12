import axiosInstance from "@/lib/axios";
import { CreateProductReviewType, ProductReviewResponse, ProductReviewType, ReviewFilters } from "../types";
import { toQueryString } from "@/utils/queryString";


export async function getReviews(filters: ReviewFilters) {
  try {
    // Convert productId to product_id for API
    const apiFilters = {
      page: filters.page,
      size: filters.size,
      product_id: filters.productId,
    };
    const response = await axiosInstance.get<ProductReviewResponse>(`/shoes/reviews/get-by-product${toQueryString(apiFilters)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
}


export async function createReview(review: CreateProductReviewType) {
  const response = await axiosInstance.post<ProductReviewType>('/shoes/reviews', review);
  return response.data;
}


export async function checkReviewEligibility(productId: string) {
  const response = await axiosInstance.get<boolean>(`/shoes/reviews/check-eligibility?product_id=${productId}`);
  return response.data;
}