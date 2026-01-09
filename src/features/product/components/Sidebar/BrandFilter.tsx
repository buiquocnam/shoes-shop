"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BrandType } from "@/features/product/types";

interface BrandFilterProps {
    brands: BrandType[];
    isLoadingBrands: boolean;
    selectedBrandId: string;
    setSelectedBrandId: (id: string) => void;
}

export function BrandFilter({
    brands,
    isLoadingBrands,
    selectedBrandId,
    setSelectedBrandId,
}: BrandFilterProps) {
    return (
        <div className="flex flex-col gap-4">
            {isLoadingBrands && brands.length === 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        {brands.map((brand) => {
                            const isActive = selectedBrandId === brand.id;
                            return (
                                <Button
                                    key={brand.id}
                                    variant="outline"
                                    onClick={() => setSelectedBrandId(isActive ? "" : brand.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-2xl bg-white border transition-all group overflow-hidden h-auto aspect-square",
                                        isActive
                                            ? "border-primary ring-1 ring-primary/20 shadow-md"
                                            : "border-border shadow-sm hover:border-primary/30 text-foreground"
                                    )}
                                >
                                    {brand.logo ? (
                                        <div className="h-10 w-full mb-1 flex items-center justify-center">
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                width={80}
                                                height={40}
                                                className={cn(
                                                    "max-h-full max-w-full object-contain transition-all",
                                                    isActive
                                                        ? "grayscale-0 opacity-100 scale-110"
                                                        : "grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                                                )}
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-full mb-1 flex items-center justify-center">
                                            <span className="text-lg font-bold">{brand.name[0]}</span>
                                        </div>
                                    )}
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-tight text-center"
                                    )}>
                                        {brand.name}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
