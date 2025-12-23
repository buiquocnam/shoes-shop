"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ImageType } from "../types";
import {  MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images: ImageType[];
  isNew?: boolean;
}

export default function ProductGallery({ images, isNew = false }: ProductGalleryProps) {
  const [current, setCurrent] = React.useState(0);
  const apiRef = React.useRef<CarouselApi | null>(null);

  const imageUrls = React.useMemo(() => {
    return images?.map((img) => img?.url);
  }, [images]);

  if (!images || images.length === 0 || imageUrls.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full max-w-md aspect-[4/3] border rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  const displayedThumbnails = imageUrls.slice(0, 4);
  const hasMoreImages = imageUrls.length > 4;

  return (
    <div className="space-y-6 w-full">
      {/* Main Image */}
      <div className="relative group bg-card rounded-3xl p-2 shadow-lg overflow-hidden border border-border">
        <Carousel
          opts={{ loop: true }}
          setApi={(api) => {
            if (!api) return;
            apiRef.current = api;
            api.on("select", () => {
              setCurrent(api.selectedScrollSnap());
            });
          }}
          className="w-full"
        >
          <CarouselContent>
            {imageUrls.map((img, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={img}
                    alt={`product-image-${i}`}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {imageUrls.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-md hover:bg-background border border-border/20 shadow-lg" />
              <CarouselNext className="right-4 bg-background/80 backdrop-blur-md hover:bg-background border border-border/20 shadow-lg" />
            </>
          )}
        </Carousel>

        {/* Badge "Mới nhất" */}
        {isNew && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md backdrop-blur-sm bg-opacity-90">
              Mới nhất
            </span>
          </div>
        )}

      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-4 gap-4">
        {displayedThumbnails.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              apiRef.current?.scrollTo(i);
            }}
            className={cn(
              "relative rounded-2xl overflow-hidden border-2 aspect-square shadow-md transition-transform hover:scale-105",
              current === i
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-border"
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
        
        {/* More Images Button */}
        {hasMoreImages && (
          <button className="relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-border aspect-square transition-all bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
