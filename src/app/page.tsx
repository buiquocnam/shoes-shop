import HeroBanner from '@/features/home/components/HeroBanner';
import HomeSection from '@/features/home/components/HomeSection';
import TopRated from '@/features/home/components/TopRated';
import HomeLoading from '@/features/home/components/HomeLoading';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shoe Shop',
  description: 'Discover high-quality sneakers and footwear at Shoe Shop. Best sellers, top-rated shoes, and the latest sneaker trends with unbeatable prices.',
};

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        image="https://thumbs.dreamstime.com/z/design-mock-up-banner-illustration-white-sport-sneaker-shoes-banner-footwear-commercials-retail-offers-isolated-335060242.jpg?ct=jpeg"
        alt="Hero Banner"
        description="Discover the best shoes for your feet"
      />

      <Suspense fallback={<HomeLoading />}>
        <HomeSection />
        <TopRated />
      </Suspense>
    </main>
  );
}

