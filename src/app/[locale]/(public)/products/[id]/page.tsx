import { productApi } from "@/features/product/services/product.api";
import { ProductGallery, ProductInfo, SimilarProducts, ReviewsLoading } from "@/features/product/components";
import type { Metadata } from "next";
import NotFound from "./not-found";
import dynamic from "next/dynamic";
import { ProductDetailType } from "@/features/product/types";

const ProductReviewDynamic = dynamic(
    () => import("@/features/product/components/details/ProductReview/ProductReview"),
    {
        loading: () => <ReviewsLoading />,
        ssr: true,
    }
);

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await productApi.getProductById(id);
    return {
        title: `${product.product.name} - Shoe Shop`,
        description: product.product.description || "",
        openGraph: {
            title: `${product.product.name} - Shoe Shop`,
            description: product.product.description || "",
            images: product.listImg?.[0]?.url ? [product.listImg[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const { id } = await params;

    // Fetch product trực tiếp, không cần QueryClient
    const product: ProductDetailType = await productApi.getProductById(id);

    if (!product) {
        return <NotFound />;
    }

    return (
        <main className="flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                <div className="lg:col-span-6 flex flex-col gap-4">
                    <ProductGallery
                        images={product.listImg || []}
                    />
                </div>
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <ProductInfo product={product} />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-12">
                <ProductReviewDynamic productId={product.product.id} />
            </div>

            <SimilarProducts
                categoryId={product.product.category?.id}
                brandId={product.product.brand?.id}
                currentProductId={product.product.id}
            />
        </main>
    );
}
