"use client";

import { Button } from "@/components/ui/button";
import { Star as StarIcon, MessageCircle } from "lucide-react";
import { STAR_COLOR } from "./constants";
import { useTranslations } from "next-intl";

interface RatingSummaryProps {
  averageRating: string;
  totalReviews: number;
  onWriteReview: () => void;
}

export function RatingSummary({
  averageRating,
  totalReviews,
  onWriteReview,
}: RatingSummaryProps) {
  const t = useTranslations('Reviews');

  return (
    <div className="md:col-span-1 text-center">
      <span className="text-5xl font-bold text-gray-900 block leading-none mb-1">
        {averageRating}
      </span>
      <div className="flex items-center justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5`}
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
        {t('rating', { count: totalReviews })}
      </p>
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <Button
            variant="outline"
            onClick={onWriteReview}
            className="gap-2 cursor-pointer border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 font-semibold px-5 py-2 rounded-full shadow"
          >
            <MessageCircle className="w-5 h-5" />
            {t('writeReview')}
          </Button>
        </div>
      </div>
    </div>
  );
}


