import { Skeleton } from "@/components/ui/skeleton";

export default function BrandListSkeleton() {
    return (
        <section className="py-16 bg-surface-light">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="size-32 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

