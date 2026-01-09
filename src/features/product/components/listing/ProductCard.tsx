"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;
    const imageUrl = product.imageUrl?.url || "/placeholder.png";
    const averageRating = product.averageRating || 0;

    return (
        <Link
            href={`/products/${product.id}`}
            className="group flex flex-col rounded-3xl h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border cursor-pointer overflow-hidden"
        >
            <div className="relative aspect-square w-full overflow-hidden">
                {product.discount > 0 && (
                    <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        -{product.discount}%
                    </span>
                )}
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    unoptimized
                />
            </div>
            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider truncate">
                        {product.brand?.name || ""}
                    </span>
                    {product.category?.name && (
                        <>
                            <span className="text-xs text-gray-600 flex-shrink-0">•</span>
                            <span className="text-xs text-gray-600 truncate">
                                {product.category.name}
                            </span>
                        </>
                    )}
                </div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-lg sm:text-xl text-primary">
                        {formatCurrency(discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-xs sm:text-sm text-gray-600 line-through font-medium">
                            {formatCurrency(product.price)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-gray-900 text-sm">
                        {averageRating.toFixed(1)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
