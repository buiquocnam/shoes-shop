import { HomeSection, BrandList, BrandListSkeleton, HomeSectionSkeleton, HeroBanner, CategorySection, CategorySectionSkeleton, HeroBannerSkeleton } from '@/features/home/components';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang Chủ Cửa Hàng Giày',
  description: 'Khám phá giày thể thao và giày dép chất lượng cao tại Cửa hàng giày. Sản phẩm bán chạy nhất, giày được đánh giá cao và xu hướng giày thể thao mới nhất với giá không thể đánh bại.',
};

export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <main className="overflow-hidden">
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroBanner />
      </Suspense>

      <Suspense fallback={<BrandListSkeleton />}>
        <BrandList />
      </Suspense>

      <Suspense fallback={<CategorySectionSkeleton />}>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton />}>
        <HomeSection />
      </Suspense>
    </main>
  );
}

