import { getProductById } from "@/features/product/services/product.api";
import { getReviews } from "@/features/product/services/review.api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ProductGallery from "@/features/product/components/ProductGallery";
import ProductInfo from "@/features/product/components/ProductInfo";
import ProductReview from "@/features/product/components/ProductReview";
import NotFound from "./not-found";
import type { Metadata } from "next";


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    return {
      title: `${product.product.name} - Shoe Shop`,
      description: product.product.description || "",
      openGraph: {
        title: `${product.product.name} - Shoe Shop`,
        description: product.product.description || "",
        images: product.listImg.map((img) => img.url),
      },
    };
  }


export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const product = await queryClient.fetchQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  if (!product) {
    return <NotFound />;
  }

  await queryClient.prefetchQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviews(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="col-span-1">
            <ProductGallery images={product.listImg || []} />
          </div>
          <div className="col-span-1">
            <ProductInfo product={product.product} variants={product.variants}  />
          </div>
        </div>

        <div className="mt-8">
          <ProductReview productId={product.product.id} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
