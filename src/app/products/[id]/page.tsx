import { productApi } from "@/features/product/services/product.api";
import { ProductGallery, ProductInfo } from "@/features/product/components";
import ReviewsLoading from "@/features/product/components/ReviewsLoading";
import type { Metadata } from "next";
import NotFound from "./not-found";
import dynamic from "next/dynamic";

// Lazy load ProductReview component - chỉ load JS bundle khi component mount
const ProductReview = dynamic(
  () => import("@/features/product/components/ProductReview"),
  {
    loading: () => <ReviewsLoading />,
    ssr: true, // Vẫn render trên server nhưng lazy load JS bundle
  }
);


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const product = await productApi.getProductById(id);
  return {
    title: `${product.product.name} - Shoe Shop`,
    description: product.product.description || "",
    openGraph: {
      title: `${product.product.name} - Shoe Shop`,
      description: product.product.description || "",
    },
  };
}


export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch product trực tiếp, không cần QueryClient
  const product = await productApi.getProductById(id);

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="col-span-1">
          <ProductGallery images={product.listImg || []} />
        </div>
        <div className="col-span-1 rounded-xl p-4">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Lazy load reviews - chỉ load JS bundle và fetch data khi component mount */}
      <div className="mt-8">
        <ProductReview productId={product.product.id} />
      </div>
    </div>
  );
}
