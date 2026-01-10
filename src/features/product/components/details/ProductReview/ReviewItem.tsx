import { Star as StarIcon } from "lucide-react";
import { formatDate } from "@/utils/date";
import type { ProductReviewType } from "@/features/product/types";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: ProductReviewType;
}



export function ReviewItem({ review }: ReviewItemProps) {
  const avatarUrl = null;
  const userName = review.user?.name || "Người dùng ẩn danh";
  const initial = userName?.[0]?.toUpperCase() || "U";

  return (
    <div className="group relative bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        {/* Avatar with gradient */}
        <div className="flex-shrink-0 shadow-md rounded-full overflow-hidden">
          <div className={cn(
            "w-12 h-12  flex items-center justify-center text-base font-bold text-primary shadow-sm ring-2 ring-background",
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
              <h4 className="text-base font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                {userName}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {review.createdDate ? formatDate(review.createdDate) : ""}
                </span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 flex-shrink-0 bg-secondary px-2.5 py-1 rounded-full border border-border">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={cn(
                      "w-4 h-4 transition-transform",
                      i < review.rating ? "fill-warning text-warning scale-100" : "text-muted-foreground scale-90"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-muted-foreground ml-1">
                {review.rating}.0
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mt-3">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
              {review.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


