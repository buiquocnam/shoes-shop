import { ProductPaginationResponse } from "../types";
import { ReusablePagination } from "@/components/ui/pagination";
import ProductCard from "./ProductCard";

interface ProductListProps {
    products: ProductPaginationResponse;
    currentPage: number;
    totalPages: number;
}

const ProductList = async ({ products, currentPage, totalPages }: ProductListProps) => {
    const productList = products.data;
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    )
}

export default ProductList;