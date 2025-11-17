'use client';

import { ProductType } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }: { product: ProductType }) {
  const router = useRouter();
  const discountedPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  const { cart } = useCartStore();
  const isInCart = cart?.items.some((item) => item.variant.id === product.id);

  const transition300 = "transition-all duration-300 ease-out";

  const handleClick = () => router.push(`/products/${product.id}`);

  return (
    <Card
      onClick={handleClick}
      className={`group relative mx-auto w-[280px] rounded-[28px] bg-white overflow-hidden 
                  shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]
                  hover:-translate-y-2 cursor-pointer ${transition300}`}
    >
      {/* DISCOUNT BADGE */}
      {product.discount > 0 && (
        <span
          className="absolute top-3 left-3 z-20 bg-primary/90 text-white 
                    text-[0.75rem] font-bold px-3 py-1 rounded-full shadow-md"
        >
          -{product.discount}% OFF
        </span>
      )}

      {/* IMAGE */}
      <div className="relative w-full h-[260px] overflow-hidden">
        <Image
          src={product.imageUrl?.url || "/placeholder.png"}
          alt={product.name}
          fill
          className={`object-cover ${transition300} group-hover:scale-110 group-hover:brightness-[1.15]`}
          sizes="(max-width: 768px) 100vw, 280px"
          unoptimized
        />

        {/* In Cart Icon */}
        {isInCart && (
          <span className="absolute top-3 right-3 z-20 bg-primary p-1.5 rounded-full text-white shadow-md">
            <CheckCircle className="w-5 h-5 fill-white" />
          </span>
        )}

       
      </div>

      {/* CONTENT */}
      <CardContent className="p-4 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 text-[0.7rem] font-semibold rounded-full bg-pink-100 text-pink-600">
            CASUAL
          </span>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(product.averageRating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({(product.averageRating || 0).toFixed(1)})
            </span>
          </div>
        </div>

        {/* NAME */}
        <h3 className="text-center text-[1rem] sm:text-[1.1rem] font-extrabold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-extrabold text-primary">
            {formatCurrency(discountedPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
