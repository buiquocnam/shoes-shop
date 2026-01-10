import { Star as StarIcon } from "lucide-react";

interface RatingBarProps {
  stars: number;
  count: number;
  totalReviews: number;
}

export function RatingBar({ stars, count, totalReviews }: RatingBarProps) {
  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 w-20 flex-shrink-0 justify-end">
        <span className="text-sm text-foreground font-normal">{stars}</span>
        <StarIcon
          className="w-3.5 h-3.5 text-warning fill-warning"
        />
      </div>

      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>

      <span className="text-sm text-foreground w-4 text-right flex-shrink-0">
        {count}
      </span>
    </div>
  );
}


