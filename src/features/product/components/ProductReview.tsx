"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddReviewDialog from "@/features/product/components/AddReviewDialog";
import { useReviews } from "../hooks/useReviews";
import { formatDate } from "@/utils/date";
import { getInitials, getAvatarColor } from "@/utils/helpers";
import { Star, MessageCircle } from "lucide-react";
import { ProductReviewType } from "../types";
import { AlertLogin } from "@/features/product/components";
import { useIsAuthenticated } from "@/store/useAuthStore";

const STAR_COLOR = "rgb(234, 179, 8)";

const calculateRatingStats = (reviews: ProductReviewType[]) => {
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

const ReviewCard = ({ review }: { review: ProductReviewType }) => {
  const userName = review.user?.name || "Người dùng ẩn danh";
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  return (
    <div className="shadow-md p-6 rounded-2xl bg-white border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`size-12 rounded-full ${avatarColor.bg} flex items-center justify-center ${avatarColor.text} font-bold text-sm shadow-sm flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-gray-900 mb-1">{userName}</h4>
            <span className="text-xs text-gray-500">
              {review.created ? formatDate(review.created) : ""} trước
            </span>
          </div>
        </div>
        <div className="flex text-amber-400 ml-2 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
              style={{
                color: i < review.rating ? STAR_COLOR : undefined,
                fill: i < review.rating ? STAR_COLOR : "",
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};

export default function ProductReview({ productId }: { productId: string }) {
  const { data: productReviews, isLoading, error } = useReviews(productId);
  const isAuthenticated = useIsAuthenticated();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
        <div className="text-center py-8 text-gray-600">Đang tải đánh giá...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
        <div className="text-center py-8 text-red-500">
          Không thể tải đánh giá
        </div>
      </div>
    );
  }

  const reviews = productReviews?.data || [];
  const { stats, averageRating, totalValidReviews } =
    calculateRatingStats(reviews);

  const isEmpty = totalValidReviews === 0;

  const handleWriteReview = () => {
    if (isAuthenticated) {
      setShowReviewDialog(true);
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
          <Button
            onClick={handleWriteReview}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            Thêm Review
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
          <div className="flex flex-col">
            <div className="flex text-amber-400 text-sm">
              {[...Array(5)].map((_, i) => {
                const ratingNum = parseFloat(averageRating);
                if (i < Math.floor(ratingNum)) {
                  return <Star key={i} className="w-[18px] h-[18px] fill-current" />;
                }
                if (i === Math.floor(ratingNum) && ratingNum % 1 >= 0.5) {
                  return <Star key={i} className="w-[18px] h-[18px] fill-current" />;
                }
                return <Star key={i} className="w-[18px] h-[18px] text-gray-300" />;
              })}
            </div>
            <span className="text-xs text-gray-600">Dựa trên {totalValidReviews} đánh giá</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isEmpty ? (
          <div className="col-span-full text-center text-gray-500 py-4">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
          </div>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* Dialogs */}
      <AddReviewDialog
        productId={productId}
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
      />
      <AlertLogin
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
}
