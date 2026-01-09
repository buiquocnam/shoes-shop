import { Star as StarIcon } from "lucide-react";
import { STAR_COLOR } from "./constants";

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
}


