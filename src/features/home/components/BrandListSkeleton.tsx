import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function BrandListSkeleton() {
    return (
        <section className="py-14 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <Skeleton
                                className={cn(
                                    "w-full aspect-square rounded-full"
                                )}
                            />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

