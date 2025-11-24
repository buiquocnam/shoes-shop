
import { productApi } from "@/features/product/services/product.api";
import { ReusablePagination } from "@/components/ui/ReusablePagination";
import ProductCard from "../ProductCard";
import { cn } from "@/utils";
import type { ProductFilters, ProductPaginationResponse } from "../../types";

interface ProductListServerProps {
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

async function ProductListServer({ searchParams }: ProductListServerProps) {

    // Parse searchParams
    const params = await searchParams;
    const currentPage = params?.page && !isNaN(parseInt(params.page))
        ? parseInt(params.page)
        : 1;


    const filters: ProductFilters = {
        ...params,
        page: currentPage,
        min_price: params?.min_price ? parseFloat(String(params.min_price)) : undefined,
        max_price: params?.max_price ? parseFloat(String(params.max_price)) : undefined,
    };

    // Tự fetch data trên server (SSR)
    const products: ProductPaginationResponse = await productApi.getProducts(filters);

    const productList = products.data;
    // const hasSearch = !!params?.search;

    if (productList.length === 0) {
        return (
            <div className="w-full  flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg font-medium mb-2">No products found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={cn(
                "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6",
                // hasSearch && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
                {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <ReusablePagination
                currentPage={products.currentPage}
                totalPages={products.totalPages}
            />
        </>
    );
}

export default ProductListServer;
