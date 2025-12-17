"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/features/shared/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const MIN_PRICE = 50;
const MAX_PRICE = 500;

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories, isLoading } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get('category_id') || ""
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get('min_price')) || MIN_PRICE,
    Number(searchParams.get('max_price')) || MAX_PRICE,
  ]);

  useEffect(() => {
    setSelectedCategoryId(searchParams.get('category_id') || "");
    setPriceRange([
      Number(searchParams.get('min_price')) || MIN_PRICE,
      Number(searchParams.get('max_price')) || MAX_PRICE,
    ]);
  }, [searchParams]);

  const buildFilterParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategoryId) {
      params.set("category_id", selectedCategoryId);
    } else {
      params.delete("category_id");
    }

    if (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE) {
      params.set("min_price", priceRange[0].toString());
      params.set("max_price", priceRange[1].toString());
    } else {
      params.delete("min_price");
      params.delete("max_price");
    }

    // Reset to page 1 when applying filters
    params.delete("page");

    return params;
  };

  const handleApplyFilters = () => {
    const params = buildFilterParams();
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCategoryId("");
    setPriceRange([MIN_PRICE, MAX_PRICE]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <Card className="w-full min-w-[280px] border-none shadow-xl">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Category</h3>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <RadioGroup
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all" />
                <Label
                  htmlFor="all"
                  className="text-sm font-normal cursor-pointer"
                >
                  All Categories
                </Label>
              </div>

              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label
                    htmlFor={category.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Price Range</h3>
          <div className="px-1">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
