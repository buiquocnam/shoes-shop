"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ImageType } from "../types";

export default function ProductGallery({ images }: { images: ImageType[] }) {
  const [current, setCurrent] = React.useState(0);
  const apiRef = React.useRef<CarouselApi | null>(null);

  const imageUrls = React.useMemo(() => {
    return images?.map((img) => img?.url);
  }, [images]);

  if (!images || images.length === 0 || imageUrls.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full max-w-md aspect-square border rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <Carousel
        opts={{ loop: true }}
        setApi={(api) => {
          if (!api) return;

          // Lưu API vào ref
          apiRef.current = api;

          // Khi carousel đổi slide → update current
          api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
          });
        }}
        className="w-full"
      >
        <CarouselContent>
          {imageUrls.map((img, i) => (
            <CarouselItem key={i}>
              <div className="aspect-square overflow-hidden rounded-xl border bg-white relative">
                <Image
                  src={img}
                  alt={`product-image-${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {imageUrls.length > 1 && (
          <>
            <CarouselPrevious className="left-2 sm:left-4 bg-white/70 hover:bg-white rounded-full shadow" />
            <CarouselNext className="right-2 sm:right-4 bg-white/70 hover:bg-white rounded-full shadow" />
          </>
        )}
      </Carousel>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 w-full justify-center">
          {imageUrls.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                apiRef.current?.scrollTo(i); // Scroll carousel trực tiếp
              }}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-lg border overflow-hidden relative flex-shrink-0 transition-all",
                current === i
                  ? "border-red-500 ring-2 ring-red-500 ring-offset-2"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              <Image
                src={img}
                alt={`thumb-${i}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
