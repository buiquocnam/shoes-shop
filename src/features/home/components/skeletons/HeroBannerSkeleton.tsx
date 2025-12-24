import { Skeleton } from "@/components/ui/skeleton";

export default function HeroBannerSkeleton() {
  return (
    <section className="relative w-full h-[500px] lg:h-[650px] overflow-hidden bg-gray-200">
      {/* Background skeleton */}
      <div className="absolute inset-0">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      
      {/* Content skeleton */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <div className="max-w-2xl space-y-6 w-full">
          {/* Badge skeleton */}
          <Skeleton className="h-7 w-32" />
          
          {/* Title skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-2/3" />
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-2 max-w-lg">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-14 w-40 rounded-full" />
        </div>
      </div>
    </section>
  );
}
