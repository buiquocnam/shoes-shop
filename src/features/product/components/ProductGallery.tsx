"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageType } from "../types";

export default function ProductGallery({ images }: { images: ImageType[] }) {
  const [index, setIndex] = useState(0);

  // Kiểm tra nếu không có ảnh, hiển thị placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[400px] h-[400px] border rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  // Đảm bảo index không vượt quá độ dài mảng
  const safeIndex = Math.min(index, images.length - 1);
  const selected = images[safeIndex]?.url;

  // Nếu không có url, hiển thị placeholder
  if (!selected) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[400px] h-[400px] border rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (i: number) => {
    if (i >= 0 && i < images.length) {
      setIndex(i);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Ảnh chính */}
      <div className="relative w-[400px] h-[400px] border rounded-2xl overflow-hidden">
        <Image
          key={selected}
          src={selected}
          alt={`product-image-${safeIndex}`}
          fill
          unoptimized={true}
          className="object-cover transition-all duration-500"
        />

        {/* Nút trái */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Nút phải */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Thumbnail */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`relative border rounded-lg overflow-hidden focus:outline-none ${
                safeIndex === i
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
            >
              {img?.url ? (
                <Image
                  src={img.url}
                  alt={`thumb-${i}`}
                  width={75}
                  height={75}
                  className="object-cover"
                />
              ) : (
                <div className="w-[75px] h-[75px] bg-gray-200" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
