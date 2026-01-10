import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSectionSkeleton() {
    return (
        <section className="py-16 bg-surface-light relative bg-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="size-10 rounded-full" />
                        <Skeleton className="size-10 rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="group relative flex flex-col bg-card rounded-2xl shadow-sm overflow-hidden">
                            <Skeleton className="w-full aspect-[4/4]" />
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-3/4" />
                                <div className="flex items-center gap-2 mt-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Skeleton className="h-12 w-64 mx-auto rounded-full" />
                </div>
            </div>
        </section>
    );
}

