import { Star as StarIcon } from "lucide-react";
import { formatDate } from "@/utils/date";
import type { ProductReviewType } from "../../types";
import { STAR_COLOR } from "./constants";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: ProductReviewType;
}



export function ReviewItem({ review }: ReviewItemProps) {
  const avatarUrl = null;
  const userName = review.user?.name || "Người dùng ẩn danh";
  const initial = userName?.[0]?.toUpperCase() || "U";

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        {/* Avatar with gradient */}
        <div className="flex-shrink-0 shadow-md rounded-full overflow-hidden">
          <div className={cn(
            "w-12 h-12  flex items-center justify-center text-base font-bold text-primary shadow-sm ring-2 ring-white",
          )}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-full h-full object-cover "
              />
            ) : (
              <span className="text-primary font-extrabold">{initial}</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header with name, date and rating */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                {userName}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {review.created ? formatDate(review.created) : ""}
                </span>
              </div>
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={cn(
                      "w-4 h-4 transition-transform",
                      i < review.rating ? "scale-100" : "scale-90"
                    )}
                    style={{
                      color: i < review.rating ? STAR_COLOR : "#e5e7eb",
                      fill: i < review.rating ? STAR_COLOR : "transparent",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700 ml-1">
                {review.rating}.0
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mt-3">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {review.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


