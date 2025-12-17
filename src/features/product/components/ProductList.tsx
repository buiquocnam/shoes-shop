"use client";

import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/product/hooks/useProducts";
import ProductCard from "./ProductCard";
import type { ProductFilters } from "../types";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

function createPaginationUrl(params: URLSearchParams, page: number) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('page', page.toString());
    return `/products?${newParams.toString()}`;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export default function ProductList() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const filters: ProductFilters = {
        page: currentPage,
        category_id: searchParams.get('category_id') || undefined,
        brand_id: searchParams.get('brand_id') || undefined,
        search: searchParams.get('search') || undefined,
        min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
        max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
        sort_by: searchParams.get('sort_by') || undefined,
        sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || undefined,
    };

    const { data: products } = useProducts(filters);
    const productList = products.data;
    const currentPageNum = products.currentPage;
    const totalPages = products.totalPages;

    if (productList.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <div className="text-center">
                    <p className="text-lg font-medium mb-2">No products found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {currentPageNum > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={createPaginationUrl(searchParams, currentPageNum - 1)}
                                />
                            </PaginationItem>
                        )}

                        {getPageNumbers(currentPageNum, totalPages).map((page, index) => {
                            if (page === 'ellipsis') {
                                return (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={createPaginationUrl(searchParams, page)}
                                        isActive={page === currentPageNum}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {currentPageNum < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href={createPaginationUrl(searchParams, currentPageNum + 1)}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}

