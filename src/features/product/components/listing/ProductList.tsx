"use client";

import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/product/hooks/useProducts";
import ProductCard from "./ProductCard";
import SortSelect from "./SortSelect";
import type { ProductFilters } from "@/types/product";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { getPageNumbers, createPaginationUrl } from "@/utils/pagination";
import ProductListLoading from "./ProductList/ProductListLoading";
import { useTranslations } from "next-intl";

export default function ProductList() {
    const t = useTranslations('Products');
    const tCommon = useTranslations('Common');
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const filters: ProductFilters = {
        page: currentPage,
        category_id: searchParams.get('category_id') || undefined,
        brand_id: searchParams.get('brand_id') || undefined,
        search: searchParams.get('search') || undefined,
        min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
        max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
        sort_by: searchParams.get('sort_by') || 'countSell',
        sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || undefined,
    };

    const { data: products, isLoading } = useProducts(filters);
    const productList = products?.data || [];
    const currentPageNum = products?.currentPage || 1;
    const totalPages = products?.totalPages || 1;

    if (isLoading) {
        return <ProductListLoading />;
    }

    if (productList.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16">
                <div className="text-center">
                    <p className="text-lg font-medium mb-2 text-gray-900">{t('noProducts')}</p>
                    <p className="text-sm text-gray-600">{t('noProductsDesc')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">{t('title')}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <SortSelect />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                                >
                                    {tCommon('pagination.previous')}
                                </PaginationPrevious>
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
                                >
                                    {tCommon('pagination.next')}
                                </PaginationNext>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}
