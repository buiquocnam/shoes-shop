import { HomeSection, BrandList, BrandListSkeleton, HomeSectionSkeleton, HeroBanner, CategorySection, CategorySectionSkeleton, HeroBannerSkeleton } from '@/features/home/components';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function HomePage() {
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

