"use client";

import { Button } from "@/components/ui/button";
import { ReviewItem } from "./ReviewItem";
import type { ProductReviewType } from "@/features/product/types";
import { useTranslations } from "next-intl";

interface ReviewListProps {
  reviews: ProductReviewType[];
  hasMoreReviews: boolean;
  onShowMore: () => void;
}

export function ReviewList({
  reviews,
  hasMoreReviews,
  onShowMore,
}: ReviewListProps) {
  const t = useTranslations('Reviews');
  const tCommon = useTranslations('Common');
  const isEmpty = reviews.length === 0;

  return (
    <div className="mt-10 border-t border-border pt-10">
      {isEmpty ? (
          <p className="text-base font-semibold text-foreground mb-1 text-center">
            {t('noReviews')}
          </p>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>

          {hasMoreReviews && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={onShowMore}
                variant="outline"
                className="gap-2 cursor-pointer border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span>{tCommon('pagination.next')}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


