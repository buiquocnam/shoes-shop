"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
    minPriceInput: string;
    maxPriceInput: string;
    setMinPriceInput: (value: string) => void;
    setMaxPriceInput: (value: string) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    handleQuickPriceRange: (min: string, max: string) => void;
}

export function PriceFilter({
    minPriceInput,
    maxPriceInput,
    setMinPriceInput,
    setMaxPriceInput,
    priceRange,
    setPriceRange,
    handleQuickPriceRange,
}: PriceFilterProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₫</span>
                    <Input
                        type="number"
                        placeholder="Tối thiểu"
                        value={minPriceInput}
                        onChange={(e) => {
                            setMinPriceInput(e.target.value);
                            if (e.target.value) {
                                setPriceRange([Number(e.target.value), priceRange[1]]);
                            }
                        }}
                        className="w-full pl-7 pr-3 py-2 bg-accent/50 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary transition-all"
                    />
                </div>
                <div className="h-px w-3 bg-border"></div>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₫</span>
                    <Input
                        type="number"
                        placeholder="Tối đa"
                        value={maxPriceInput}
                        onChange={(e) => {
                            setMaxPriceInput(e.target.value);
                            if (e.target.value) {
                                setPriceRange([priceRange[0], Number(e.target.value)]);
                            }
                        }}
                        className="w-full pl-7 pr-3 py-2 bg-accent/50 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary transition-all"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {[
                    { min: "500000", max: "1000000", label: "500K-1M" },
                    { min: "1000000", max: "2000000", label: "1M-2M" },
                    { min: "2000000", max: "5000000", label: "2M-5M" },
                ].map((range) => {
                    const isActive =
                        minPriceInput === range.min && maxPriceInput === range.max;
                    return (
                        <Button
                            key={range.label}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickPriceRange(range.min, range.max)}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-full transition-all uppercase h-7",
                                isActive
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            {range.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
