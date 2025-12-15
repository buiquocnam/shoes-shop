import { categoriesApi } from "@/features/shared/services";
import Sidebar from "@/features/product/components/Sidebar";
import type { Metadata } from "next";
import { Suspense } from "react";
import ProductListServer from "@/features/product/components/ProductList/ProductListServer";
import ProductListLoading from "@/features/product/components/ProductList/ProductListLoading";
import { CategoryType } from "@/features/product/types";

export const metadata: Metadata = {
    title: "Products - Shoe Shop",
    description: "Browse our collection of shoes",
};

interface ProductPageProps {
    searchParams?: Promise<{
        page?: string;
        category_id?: string;
        brand_id?: string;
        search?: string;
        min_price?: string | number;
        max_price?: string | number;
        sort_by?: string;
        sort_order?: "asc" | "desc";
    }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
    const params = await searchParams;

    // Chỉ fetch categories trên server
    const categories = await categoriesApi.getAll().catch(() => []);

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8">
                    {/* Sidebar - Mobile: ở trên, không sticky (có thể scroll), Desktop: sticky bên trái */}
                    <aside className="md:sticky md:top-32 md:self-start md:h-fit border-none shadow-lg">
                        <Sidebar
                            selectedCategory={params?.category_id || ''}
                            categories={categories as CategoryType[]}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="min-w-0">
                        <Suspense
                            key={JSON.stringify(params)}
                            fallback={<ProductListLoading />}
                        >
                            <ProductListServer searchParams={searchParams} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}