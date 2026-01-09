import type { ProductReviewType } from "../../types";

export const calculateRatingStats = (reviews: ProductReviewType[]) => {
  const stats = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let totalRatingSum = 0;
  let validReviewCount = 0;

  reviews.forEach((review) => {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating)));
    stats[rating as keyof typeof stats]++;
    totalRatingSum += review.rating;
    validReviewCount++;
  });

  const averageRating =
    validReviewCount > 0 ? totalRatingSum / validReviewCount : 0;

  return {
    stats,
    averageRating: averageRating.toFixed(1),
    totalValidReviews: validReviewCount,
  };
};


