import { HomeSection, BrandList, BrandListSkeleton, HomeLoading, HeroBanner } from '@/features/home/components';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shoe Shop',
  description: 'Discover high-quality sneakers and footwear at Shoe Shop. Best sellers, top-rated shoes, and the latest sneaker trends with unbeatable prices.',
};



export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        image="https://thumbs.dreamstime.com/z/design-mock-up-banner-illustration-white-sport-sneaker-shoes-banner-footwear-commercials-retail-offers-isolated-335060242.jpg?ct=jpeg"
        alt="Hero Banner"
        description="Discover the best shoes for your feet"
      />

      <Suspense fallback={<BrandListSkeleton />}>
        <BrandList />
      </Suspense>

      <Suspense fallback={<HomeLoading />}>
        <HomeSection />
      </Suspense>
    </main>
  );
}

