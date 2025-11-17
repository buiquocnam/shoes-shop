import { getProducts } from "@/features/product/services/product.api";
import { categoriesApi } from "@/features/shared/services";
import Sidebar from "@/features/product/components/Sidebar";
import type { Metadata } from "next";
import ProductList from "@/features/product/components/ProductList";
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { CategoryType } from "@/features/product/types";


export const metadata: Metadata = {
    title: "Products - Shoe Shop",
    description: "Browse our collection of shoes",
};

interface ProductPageProps {
    searchParams?: Promise<{
        page?: string;
        categories_id?: string;
        brand_id?: string;
        search?: string;
        min_price?: number;
        max_price?: number;
        sort_by?: string;
        sort_order?: "asc" | "desc";
    }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
    const params = await searchParams;
    const currentPage = params?.page && !isNaN(parseInt(params.page))
        ? parseInt(params.page)
        : 1;

    const filters = { ...params, page: currentPage };

    const [products, categories] = await Promise.all([
        getProducts(filters),
        categoriesApi.getAll().catch(() => []),
    ]);

    // Hydrate React Query với data từ server
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['products', filters],
        queryFn: () => Promise.resolve(products),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex gap-8">
                        <aside className="rounded-xl shadow p-4 h-fit sticky top-8 border border-gray-200">
                            <Sidebar
                                selectedCategory={params?.categories_id}
                                categories={categories as CategoryType[]}
                            />
                        </aside>
                        <main className="md:col-span-3 w-full">
                            <div className="flex flex-col gap-4">
                                {products.data.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600 text-lg">No products found</p>
                                    </div>
                                ) : (
                                    <ProductList
                                        products={products}
                                        currentPage={products.currentPage}
                                        totalPages={products.totalPages}
                                    />
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    );
}