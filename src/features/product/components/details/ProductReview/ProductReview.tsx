"use client";

import { useState, useEffect } from "react";
import { useReviews } from "@/features/product/hooks/useReviews";
import { AlertLogin } from "@/features/product/components";
import AddReviewDialog from "../AddReviewDialog";
import { useAuthStore } from "@/store";
import { RatingSummary } from "./RatingSummary";
import { RatingStats } from "./RatingStats";
import { ReviewList } from "./ReviewList";
import { calculateRatingStats } from "./utils";
import type { ProductReviewType } from "@/features/product/types";
import { useTranslations } from "next-intl";

const DEFAULT_PAGE_SIZE = 10;

export default function ProductReview({ productId }: { productId: string }) {
  const t = useTranslations('Reviews');
  const tCommon = useTranslations('Common');
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedReviews, setAccumulatedReviews] = useState<ProductReviewType[]>([]);
  const pageSize = DEFAULT_PAGE_SIZE;

  const { data: productReviews, isLoading, error } = useReviews({
    productId,
    page: currentPage,
    size: pageSize,
  });

  const { user } = useAuthStore();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Reset accumulated reviews when productId changes
  useEffect(() => {
    setAccumulatedReviews([]);
    setCurrentPage(1);
  }, [productId]);

  // Accumulate reviews when new data is fetched
  useEffect(() => {
    if (productReviews?.data) {
      if (currentPage === 1) {
        // Reset when loading first page
        setAccumulatedReviews(productReviews.data);
      } else {
        // Append new reviews when loading more pages
        setAccumulatedReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newReviews = productReviews.data.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newReviews];
        });
      }
    }
  }, [productReviews?.data, currentPage]);

  if (isLoading && accumulatedReviews.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-card rounded-xl shadow-lg">
        <div className="text-center py-8 text-muted-foreground">{tCommon('loading')}</div>
      </div>
    );
  }

  if (error && accumulatedReviews.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-card rounded-xl shadow-lg">
        <div className="text-center py-8 text-destructive">
          {tCommon('error')}
        </div>
      </div>
    );
  }

  // Calculate stats from all accumulated reviews for rating summary
  const { stats, averageRating, totalValidReviews } =
    calculateRatingStats(accumulatedReviews);

  const hasMoreReviews = (productReviews?.currentPage || 1) < (productReviews?.totalPages || 0);

  const handleShowMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleWriteReview = () => {
    if (user) {
      setShowReviewDialog(true);
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-10 bg-card rounded-xl shadow-xl mt-8">
      <h2 className="text-3xl font-bold mb-12 mt-20 text-center uppercase">
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalValidReviews}
          onWriteReview={handleWriteReview}
        />
        <RatingStats stats={stats} totalReviews={totalValidReviews} />
      </div>

      <ReviewList
        reviews={accumulatedReviews}
        hasMoreReviews={hasMoreReviews}
        onShowMore={handleShowMore}
      />

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

