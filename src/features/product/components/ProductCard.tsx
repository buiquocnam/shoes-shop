"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { ProductType } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;
    const imageUrl = product.imageUrl?.url || "/placeholder.png";
    const averageRating = product.averageRating || 0;
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };


    return (
        <Card
            onClick={handleCardClick}
            className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 cursor-pointer
                 transition-all duration-300 border flex flex-col border-none"
        >
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                {product.discount > 0 && (
                    <Badge
                        variant="default"
                        className={cn(
                            "absolute top-3 left-3 z-20 bg-primary",
                            "text-white text-xs font-bold px-2 py-1 rounded"
                        )}
                    >
                        -{product.discount}%
                    </Badge>
                )}

                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover object-center transition-transform duration-500",
                        "hover:scale-105"
                    )}
                    unoptimized
                />


            </div>

            <CardContent className="p-5 flex flex-col flex-1">
                {product.category?.name && (
                    <span className="text-primary font-bold text-xs uppercase tracking-widest mb-1">
                        {product.category.name}
                    </span>
                )}

                <h3
                    className={cn(
                        "font-bold text-lg mb-2 leading-snug group-hover:text-primary transition-colors"
                    )}
                >
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
                    {[...Array(5)].map((_, i) => {
                        if (i < fullStars) {
                            return (
                                <Star
                                    key={i}
                                    size={16}
                                    className="fill-current text-yellow-400"
                                />
                            );
                        }
                        if (i === fullStars && hasHalfStar) {
                            return (
                                <Star
                                    key={i}
                                    size={16}
                                    className="fill-current text-yellow-400"
                                />
                            );
                        }
                        return (
                            <Star
                                key={i}
                                size={16}
                                className="text-gray-300"
                            />
                        );
                    })}
                    <span className="text-gray-500 text-xs ml-1">
                        ({averageRating.toFixed(1)})
                    </span>
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                    <div className="flex flex-col pt-2">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-gray-400 line-through text-xs">
                                    {formatCurrency(product.price)}
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(discountedPrice)}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(discountedPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

