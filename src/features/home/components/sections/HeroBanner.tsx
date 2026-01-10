"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useBanners } from "@/features/shared";
import { useTranslations } from "next-intl";

const HeroBanner = () => {
  const t = useTranslations('HomePage.hero');
  const { data } = useBanners();
  const banners = data?.data || [];
  const bannerImages = banners.map(b => b.imageUrl).filter(Boolean);

  // Fallback image nếu không có banner
  const defaultImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop";
  const images = bannerImages.length > 0 ? bannerImages : [defaultImage];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide nếu có nhiều ảnh
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[500px] lg:h-[650px] overflow-hidden bg-background-dark group">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={imageUrl}
              alt={`Hero Banner ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="100vw"
              quality={85}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

      {/* Content - Text cố định */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block py-1 px-3 mb-4 rounded bg-primary/20 border border-primary text-primary text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
            {t('tag')}
          </span>

          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            {t('title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">{t('accent')}</span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
            {t('description')}
          </p>

          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary hover:bg-primary-hover text-white text-lg font-bold tracking-wide transition-all shadow-lg shadow-primary/40 hover:-translate-y-1"
          >
            {t('cta')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

