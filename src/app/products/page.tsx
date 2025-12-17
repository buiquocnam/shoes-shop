import { Suspense } from "react";
import Sidebar from "@/features/product/components/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import ProductListLoading from "@/features/product/components/ProductList/ProductListLoading";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products - Shoe Shop",
    description: "Browse our collection of shoes",
};

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-background py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8">
                    <aside className="md:sticky md:top-32 md:self-start md:h-fit">
                        <Sidebar />
                    </aside>

                    <main className="min-w-0">
                        <Suspense fallback={<ProductListLoading />}>
                            <ProductList />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}