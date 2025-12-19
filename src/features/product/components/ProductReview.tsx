"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddReviewDialog from "@/features/product/components/AddReviewDialog";
import { useReviews } from "../hooks/useReviews";
import { formatDate } from "@/utils/date";
import { StarIcon, MessageCircle } from "lucide-react";
import { ProductReviewType } from "../types";
import { AlertLogin } from "@/features/product/components";
import { useAuthStore } from "@/store/useAuthStore";

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

const RatingBar = ({
  stars,
  count,
  totalReviews,
}: {
  stars: number;
  count: number;
  totalReviews: number;
}) => {
  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 w-20 flex-shrink-0 justify-end">
        <span className="text-sm text-gray-700 font-normal">{stars}</span>
        <StarIcon
          className="w-3.5 h-3.5"
          style={{ color: STAR_COLOR, fill: STAR_COLOR }}
        />
      </div>

      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "rgb(148, 23, 50)",
          }}
        ></div>
      </div>

      <span className="text-sm text-gray-700 w-4 text-right flex-shrink-0">
        {count}
      </span>
    </div>
  );
};

const ReviewItem = ({ review }: { review: ProductReviewType }) => {
  const avatarUrl = null;
  const userName = review.user?.name || "Người dùng ẩn danh";
  const initial = userName?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex items-start gap-4 pb-6 pt-4 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {initial}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-col">
            <h4 className="text-base font-semibold text-gray-900 leading-tight">
              {userName}
            </h4>
            <span className="text-xs text-gray-400">
              {review.created ? formatDate(review.created) : ""} trước
            </span>
          </div>
          {/* Rating Sao bên phải - Màu VÀNG */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-3.5 h-3.5 ${i < review.rating ? "" : "text-gray-300 fill-gray-300"
                  }`}
                style={{
                  color: STAR_COLOR,
                  fill: i < review.rating ? STAR_COLOR : "",
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mt-1">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

export default function ProductReview({ productId }: { productId: string }) {
  const { data: productReviews, isLoading, error } = useReviews(productId);
  const { isAuthenticated } = useAuthStore();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-white rounded-xl shadow-lg">
        <div className="text-center py-8 text-gray-600">Đang tải đánh giá...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-white rounded-xl shadow-lg">
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-primary/3 rounded-xl shadow-xl mt-8 ">
      <h2 className="text-3xl font-bold mb-12 mt-20 text-center uppercase">Đánh giá khách hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CỘT TRÁI (1/3): ĐIỂM TRUNG BÌNH & NÚT */}
        <div className="md:col-span-1 text-center">
          {" "}
          <span className="text-5xl font-bold text-gray-900 block leading-none mb-1">
            {averageRating}
          </span>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5`}
                // Sao màu VÀNG
                style={{
                  color: STAR_COLOR,
                  fill:
                    i < Math.floor(parseFloat(averageRating))
                      ? STAR_COLOR
                      : "rgb(229, 231, 235)",
                }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Dựa trên {totalValidReviews} đánh giá
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Button
                variant="outline"
                onClick={handleWriteReview}
                className="gap-2 cursor-pointer border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 font-semibold px-5 py-2 rounded-full shadow"
              >
                <MessageCircle className="w-5 h-5" />
                Viết đánh giá
              </Button>
            </div>
          </div>
        </div>

        {/* CỘT GIỮA VÀ PHẢI (2/3): THANH THỐNG KÊ CHI TIẾT */}
        <div className="md:col-span-2 space-y-3 pt-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <RatingBar
              key={stars}
              stars={stars}
              count={stats[stars as keyof typeof stats]}
              totalReviews={totalValidReviews}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8">
        {isEmpty ? (
          <div className="text-center text-gray-500 py-4">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
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
