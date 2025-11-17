import { getProducts } from "@/features/product/services/product.api";
import ProductList from "@/features/product/components/ProductList";
import { ApiError } from "@/types/api";
import { ProductPaginationResponse } from "@/features/product/types";

export default async function HomeSection() {
    // ✅ Handle authentication errors gracefully
    let products;
   

        products = await getProducts();
      

    return (
        <div className="pt-8">
            <div className="max-w-6xl mx-auto px-20">
                <h2
                    className="text-3xl font-bold text-center mb-8 uppercase tracking-widest"
                    style={{ textShadow: '6px 6px 8px rgba(0, 0, 0, 0.4)' }}
                >
                    Best Sellers
                </h2>

                <ProductList
                    products={products as ProductPaginationResponse}
                    currentPage={products?.currentPage}
                    totalPages={products?.totalPages}
                />
            </div>
        </div>
    )
} 