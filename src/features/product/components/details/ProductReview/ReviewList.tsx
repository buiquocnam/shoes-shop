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
    <div className="mt-10 border-t border-gray-200 pt-10">
      {isEmpty ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-1">
                {t('noReviews')}
              </p>
              <p className="text-sm text-gray-500">
                Hãy là người đầu tiên đánh giá sản phẩm này!
              </p>
            </div>
          </div>
        </div>
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
                className="gap-2 cursor-pointer border-2 border-primary text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
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


