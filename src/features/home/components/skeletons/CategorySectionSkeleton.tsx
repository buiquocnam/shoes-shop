import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySectionSkeleton() {
    return (
        <section className="py-16 bg-background-light">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-2xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}

