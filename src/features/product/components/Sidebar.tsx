"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/features/shared/hooks/useCategories";
import { useBrands } from "@/features/shared/hooks/useBrands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MIN_PRICE = 500000; // 500,000 VND
const MAX_PRICE = 5000000; // 5,000,000 VND

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
  const [minPriceInput, setMinPriceInput] = useState<string>(
    searchParams.get('min_price') || ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    searchParams.get('max_price') || ''
  );

  useEffect(() => {
    const categoryId = searchParams.get('category_id') || "";
    const brandId = searchParams.get('brand_id') || "";
    const minPrice = searchParams.get('min_price') || '';
    const maxPrice = searchParams.get('max_price') || '';
    
    setSelectedCategoryId(categoryId);
    setSelectedBrandId(brandId);
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
    setPriceRange([
      Number(minPrice) || MIN_PRICE,
      Number(maxPrice) || MAX_PRICE,
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

    const minPrice = minPriceInput ? Number(minPriceInput) : MIN_PRICE;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : MAX_PRICE;

    if (minPrice !== MIN_PRICE || maxPrice !== MAX_PRICE) {
      params.set("min_price", minPrice.toString());
      params.set("max_price", maxPrice.toString());
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
    setMinPriceInput('');
    setMaxPriceInput('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id");
    params.delete("brand_id");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  const handleQuickPriceRange = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    setPriceRange([Number(min), Number(max)]);
  };

  return (
    <aside className="w-full flex flex-col gap-8 bg-white p-4 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold uppercase tracking-tight">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs font-bold text-primary hover:underline hover:text-primary/80 hover:bg-transparent h-auto p-0"
        >
          Reset All
        </Button>
      </div>

      <div className="space-y-10">
        {/* Price Range Block */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full group h-auto p-0 hover:bg-transparent"
          >
            <span className="font-bold text-sm uppercase tracking-wide text-primary">Giá</span>
          </Button>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₫</span>
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
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
              <div className="h-px w-3 bg-slate-300"></div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₫</span>
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
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { min: '500000', max: '1000000', label: '500K-1M' },
                { min: '1000000', max: '2000000', label: '1M-2M' },
                { min: '2000000', max: '5000000', label: '2M-5M' }
              ].map(range => {
                const isActive = minPriceInput === range.min && maxPriceInput === range.max;
                return (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPriceRange(range.min, range.max)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold rounded-full transition-colors uppercase",
                      isActive
                        ? "bg-primary text-white border-primary"
                        : "border-slate-200 "
                    )}
                  >
                   {range.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brands Block */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full group h-auto p-0 hover:bg-transparent"
          >
            <span className="font-bold text-sm uppercase tracking-wide text-primary">Thương hiệu</span>
          </Button>
          {isLoadingBrands ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {brands.map((brand) => {
                const isActive = selectedBrandId === brand.id;
                return (
                  <Button
                    key={brand.id}
                    variant="outline"
                    onClick={() => setSelectedBrandId(isActive ? "" : brand.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl bg-white border transition-all group overflow-hidden h-auto",
                      isActive
                        ? "border-primary ring-1 ring-primary/20 shadow-md"
                        : "border-slate-100 shadow-sm hover:border-primary/30 text-gray-900"
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
                              ? "grayscale-0 opacity-100"
                              : "grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"
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
          )}
        </div>

        {/* Categories Block */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full group h-auto p-0 hover:bg-transparent"
          >
            <span className="font-bold text-sm uppercase tracking-wide text-primary">Danh mục</span>
          </Button>
          {isLoadingCategories ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  checked={selectedCategoryId === ""}
                  onChange={() => setSelectedCategoryId("")}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-transparent transition-all"
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  Tất cả danh mục
                </span>
              </label>
              {categories?.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    checked={selectedCategoryId === category.id}
                    onChange={() => setSelectedCategoryId(category.id)}
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-transparent transition-all"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button onClick={handleApplyFilters} className="w-full mt-4">
        Áp dụng bộ lọc
      </Button>
    </aside>
  );
}
