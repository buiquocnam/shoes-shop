"use client";

import { useState, useEffect } from 'react';
import { CategoryType } from "../types";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  selectedCategory?: string;
  categories?: CategoryType[];
}

const MIN_PRICE = 50;
const MAX_PRICE = 500;

export default function Sidebar({ selectedCategory, categories }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory || '');
  const [priceRange, setPriceRange] = useState<number[]>([MIN_PRICE, MAX_PRICE]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategoryId) {
      params.set('category_id', selectedCategoryId);
    } else {
      params.delete('category_id');
    }

    if (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE) {
      params.set('min_price', priceRange[0].toString());
      params.set('max_price', priceRange[1].toString());
    } else {
      params.delete('min_price');
      params.delete('max_price');
    }

    // Reset to page 1 when applying filters
    params.delete('page');

    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCategoryId('');
    setPriceRange([MIN_PRICE, MAX_PRICE]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('category_id');
    params.delete('min_price');
    params.delete('max_price');
    params.delete('page');

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full min-w-[280px] bg-white rounded-lg border border-gray-200 p-4 shadow-md">
      <h2 className="font-bold text-lg text-gray-900 pb-3 border-b mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Category</h3>
        <RadioGroup
          value={selectedCategoryId}
          onValueChange={(value) => {
            setSelectedCategoryId(value);
          }}
          className="space-y-2"
        >
          {/* All option */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value=""
              id="all"
              className="text-primary border-gray-300"
            />
            <Label
              htmlFor="all"
              className="text-sm font-normal text-gray-700 cursor-pointer"
            >
              All Categories
            </Label>
          </div>

          {categories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={category.id}
                id={category.id}
                className="text-primary border-gray-300"
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-gray-900 mb-4">Price Range</h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          Apply Filters
        </Button>
        <button
          onClick={handleReset}
          className="w-full text-sm text-gray-700 hover:text-gray-900 underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
