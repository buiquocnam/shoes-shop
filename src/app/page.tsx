import { HomeSection, BrandList, BrandListSkeleton, HomeLoading, HeroBanner } from '@/features/home/components';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cửa hàng giày',
  description: 'Khám phá giày thể thao và giày dép chất lượng cao tại Cửa hàng giày. Sản phẩm bán chạy nhất, giày được đánh giá cao và xu hướng giày thể thao mới nhất với giá không thể đánh bại.',
};



export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <main className="overflow-hidden">
      <HeroBanner />

      <Suspense fallback={<BrandListSkeleton />}>
        <BrandList />
      </Suspense>

      <Suspense fallback={<HomeLoading />}>
        <HomeSection />
      </Suspense>
    </main>
  );
}

