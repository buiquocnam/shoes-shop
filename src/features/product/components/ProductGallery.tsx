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
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [current, setCurrent] = React.useState(0);
  const apiRef = React.useRef<CarouselApi | null>(null);

  const imageUrls = React.useMemo(() => {
    return images?.map((img) => img?.url);
  }, [images]);

  if (!images || images.length === 0 || imageUrls.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full max-w-md aspect-square border rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  const displayedThumbnails = imageUrls.slice(0, 4);
  const hasMoreImages = imageUrls.length > 4;

  return (
    <div className="space-y-2 w-full">
      {/* Main Image */}
      <div className="relative group bg-card rounded-xl shadow-sm overflow-hidden border border-border">
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
          <CarouselContent className="-ml-0">
            {imageUrls.map((img, i) => (
              <CarouselItem key={i} className="pl-0 basis-full">
                <div className="relative w-full aspect-square overflow-hidden ">
                  <Image
                    src={img}
                    alt={`product-image-${i}`}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {imageUrls.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-md hover:bg-background border border-border/20 shadow-md" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-md hover:bg-background border border-border/20 shadow-md" />
            </>
          )}
        </Carousel>


      </div>

      {/* Thumbnails Grid */}
      <div className="flex flex-wrap justify-center gap-2">
        {displayedThumbnails.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              apiRef.current?.scrollTo(i);
            }}
            className={cn(
              "relative rounded-lg overflow-hidden border-2 aspect-square shadow-xs transition-transform hover:scale-105 w-26 h-26",
              current === i
                ? "border-primary ring-1 ring-primary/20"
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
          <button className="relative rounded-lg overflow-hidden border-2 border-transparent hover:border-border aspect-square transition-all bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent w-20 h-20">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
