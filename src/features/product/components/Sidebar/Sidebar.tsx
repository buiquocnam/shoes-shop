"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/features/shared/hooks/useCategories";
import { useBrands } from "@/features/shared/hooks/useBrands";
import { Button } from "@/components/ui/button";
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

import { BrandFilter } from "./BrandFilter";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";

const MIN_PRICE = 50 * 1000; // 50,000 VND
const MAX_PRICE = 50000 * 1000; // 50,000,000 VND

export default function Sidebar() {
    const t = useTranslations('Sidebar');
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategoryId, setSelectedCategoryId] = useState(
        searchParams.get("category_id") || ""
    );
    const [selectedBrandId, setSelectedBrandId] = useState(
        searchParams.get("brand_id") || ""
    );
    const [priceRange, setPriceRange] = useState<number[]>([
        Number(searchParams.get("min_price")) || MIN_PRICE,
        Number(searchParams.get("max_price")) || MAX_PRICE,
    ]);
    const [minPriceInput, setMinPriceInput] = useState<string>(
        searchParams.get("min_price") || ""
    );
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        searchParams.get("max_price") || ""
    );

    const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
    const { data: brandsData, isLoading: isLoadingBrands } = useBrands();

    const categories = categoriesData?.data || [];
    const brands = brandsData?.data || [];

    useEffect(() => {
        const categoryId = searchParams.get("category_id") || "";
        const brandId = searchParams.get("brand_id") || "";
        const minPrice = searchParams.get("min_price") || "";
        const maxPrice = searchParams.get("max_price") || "";

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
        setMinPriceInput("");
        setMaxPriceInput("");

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
        <ShadcnSidebar
            collapsible="none"
            className="w-full border-none p-4 rounded-lg bg-card h-full max-h-[calc(100vh-4rem)]"
        >
            <SidebarHeader className="px-0 pb-4">
                <h3 className="text-xl font-bold text-center">{t('title')}</h3>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="hover:underline flex-1"
                    >
                        {t('reset')}
                    </Button>

                    <Button onClick={handleApplyFilters} className="flex-1">
                        {t('apply')}
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-0 gap-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-colors">
                <Accordion
                    type="multiple"
                    defaultValue={["price", "brand", "category"]}
                    className="w-full"
                >
                    {/* Price Range Section */}
                    <AccordionItem value="price" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="font-bold text-sm uppercase tracking-wide text-primary">
                                {t('price')}
                            </span>
                        </AccordionTrigger>
                        <PriceFilter
                            minPriceInput={minPriceInput}
                            maxPriceInput={maxPriceInput}
                            setMinPriceInput={setMinPriceInput}
                            setMaxPriceInput={setMaxPriceInput}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            handleQuickPriceRange={handleQuickPriceRange}
                        />
                    </AccordionItem>


                    {/* Brands Section */}
                    <AccordionItem value="brand" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="font-bold text-sm uppercase tracking-wide text-primary">
                                {t('brand')}
                            </span>
                        </AccordionTrigger>
                        <BrandFilter
                            brands={brands}
                            isLoadingBrands={isLoadingBrands}
                            selectedBrandId={selectedBrandId}
                            setSelectedBrandId={setSelectedBrandId}
                        />
                    </AccordionItem>

                    {/* Categories Section */}
                    <AccordionItem value="category" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="font-bold text-sm uppercase tracking-wide text-primary">
                                {t('category')}
                            </span>
                        </AccordionTrigger>
                        <CategoryFilter
                            categories={categories}
                            isLoadingCategories={isLoadingCategories}
                            selectedCategoryId={selectedCategoryId}
                            setSelectedCategoryId={setSelectedCategoryId}
                        />
                    </AccordionItem>
                </Accordion>
            </SidebarContent>
        </ShadcnSidebar>
    );
}
