"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/features/shared/hooks/useCategories";
import { useBrands } from "@/features/shared/hooks/useBrands";
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
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands();
  const brands = brandsData?.data || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get('category_id') || ""
  );
  const [selectedBrandId, setSelectedBrandId] = useState(
    searchParams.get('brand_id') || ""
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get('min_price')) || MIN_PRICE,
    Number(searchParams.get('max_price')) || MAX_PRICE,
  ]);

  useEffect(() => {
    setSelectedCategoryId(searchParams.get('category_id') || "");
    setSelectedBrandId(searchParams.get('brand_id') || "");
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

    if (selectedBrandId) {
      params.set("brand_id", selectedBrandId);
    } else {
      params.delete("brand_id");
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
    setSelectedBrandId("");
    setPriceRange([MIN_PRICE, MAX_PRICE]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id");
    params.delete("brand_id");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <Card className="w-full min-w-[280px] border-none shadow-xl pt-4">
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Danh mục</h3>
          {isLoadingCategories ? (
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
                <RadioGroupItem value="" id="all-category" />
                <Label
                  htmlFor="all-category"
                  className="text-sm font-normal cursor-pointer"
                >
                  Tất cả danh mục
                </Label>
              </div>

              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                  <Label
                    htmlFor={`category-${category.id}`}
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

        {/* Brand Filter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Thương hiệu</h3>
          {isLoadingBrands ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <RadioGroup
              value={selectedBrandId}
              onValueChange={setSelectedBrandId}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-brand" />
                <Label
                  htmlFor="all-brand"
                  className="text-sm font-normal cursor-pointer"
                >
                  Tất cả thương hiệu
                </Label>
              </div>

              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={brand.id} id={`brand-${brand.id}`} />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Khoảng giá</h3>
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
              <span>{priceRange[0]}K</span>
              <span>{priceRange[1]}K</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Áp dụng bộ lọc
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full"
          >
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
