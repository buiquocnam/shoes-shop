"use client"

import ProductCard from "../listing/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { ProductFilters } from "@/types/product";
import { useProducts } from "../../hooks/useProducts";
import { ProductType } from "../../types";
import ProductListLoading from "../listing/ProductListLoading";

interface SimilarProductsProps {
    categoryId?: string;
    brandId?: string;
    currentProductId: string;
}

export default function SimilarProducts({
    categoryId,
    brandId,
    currentProductId,
}: SimilarProductsProps) {
    if (!categoryId && !brandId) {
        return null;
    }

    const filters: ProductFilters = {
        size: 4,
        page: 1,
    };

    if (categoryId) {
        filters.category_id = categoryId;
    }

    if (brandId) {
        filters.brand_id = brandId;
    }

    const { data: products, isLoading } = useProducts(filters);
    const productList = products?.data || [];

    const similarProducts = productList.filter(
        (product: ProductType) => product.id !== currentProductId
    );

    if (similarProducts.length === 0) {
        return null;
    }
    if (isLoading) {
        return <ProductListLoading />;
    }

    return (
            <div className="border-t border-border pt-12 max-w-7xl mx-auto w-full px-4 sm:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Sản phẩm tương tự</h2>
                    <Button
                        asChild
                        variant="ghost"
                        className="text-sm font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                    >
                        <Link href="/products">
                            Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarProducts.map((product: ProductType) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        )
}
