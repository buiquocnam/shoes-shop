import HeroBanner from '@/features/home/components/HeroBanner';
import HomeSection from '@/features/home/components/HomeSection';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Home - Shoe Shop',
  description: 'Welcome to Shoe Shop - Your favorite shoe store',
};

export default function HomePage() {
  return (
    <>
      <main>
        <HeroBanner
          image="https://thumbs.dreamstime.com/z/design-mock-up-banner-illustration-white-sport-sneaker-shoes-banner-footwear-commercials-retail-offers-isolated-335060242.jpg?ct=jpeg"
          alt="Hero Banner"
          description="Discover the best shoes for your feet"
        />
        <HomeSection /> 
      </main>
    </>
  );
}

