"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useBanners } from "@/features/shared";
import { useTranslations } from "next-intl";
import { Banner } from "@/types/banner";

const HeroBanner = () => {
  const t = useTranslations('HomePage.hero');
  const { data } = useBanners();
  const banners: Banner[] = (data?.data || []).filter((banner: Banner) => banner.active);

  // Fallback image and title if no banners
  const defaultImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop";
  const defaultTitle = "Discover Your Perfect Shoes";

  const slides = banners.length > 0
    ? banners.map(b => ({ imageUrl: b.imageUrl, title: b.title }))
    : [{ imageUrl: defaultImage, title: defaultTitle }];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide if there are multiple banners
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[500px] lg:h-[650px] overflow-hidden bg-muted group">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
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
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent"></div>

      {/* Content - Title changes with slideshow */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-black text-foreground leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              {slides[currentIndex].title}
            </span>
          </h1>

          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold tracking-wide transition-all shadow-lg shadow-primary/40 hover:-translate-y-1"
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

