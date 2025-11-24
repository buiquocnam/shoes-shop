import { productApi } from "@/features/product/services/product.api";
import { getReviews } from "@/features/product/services/review.api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import  {ProductGallery, ProductInfo, ProductReview} from "@/features/product/components";
import type { Metadata } from "next";
import NotFound from "./not-found";
import { queryKeys } from "@/features/shared";


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
  const queryClient = new QueryClient();

  const product = await queryClient.fetchQuery({
    queryKey: queryKeys.product.detail(id),
    queryFn: () => productApi.getProductById(id),
  });

  if (!product) {
    return <NotFound />;
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.review.lists(id),
    queryFn: () => getReviews(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="col-span-1">
            <ProductGallery images={product.listImg || []} />
          </div>
          <div className="col-span-1 rounded-xl p-4">
            <ProductInfo product={product}  />
          </div>
        </div>

        <div className="mt-8">
          <ProductReview productId={product.product.id} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
