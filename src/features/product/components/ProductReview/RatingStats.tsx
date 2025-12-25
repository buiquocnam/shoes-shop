import { RatingBar } from "./RatingBar";

interface RatingStatsProps {
  stats: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
}

export function RatingStats({ stats, totalReviews }: RatingStatsProps) {
  return (
    <div className="md:col-span-2 space-y-3 pt-2">
      {[5, 4, 3, 2, 1].map((stars) => (
        <RatingBar
          key={stars}
          stars={stars}
          count={stats[stars as keyof typeof stats]}
          totalReviews={totalReviews}
        />
      ))}
    </div>
  );
}


