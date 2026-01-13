"use client";

import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { useMemo } from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/features/cart/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations('Products');
    const { cart } = useCart();

    // Check if any variant of this product is in cart
    const isInCart = useMemo(() => {
        if (!cart?.items || !product?.id) return false;
        return cart.items.some(item =>
            item.product?.id === product.id
        );
    }, [cart?.items, product?.id]);

    const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;
    const imageUrl = product.imageUrl?.url || "/placeholder.png";
    const averageRating = product.averageRating || 0;

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="p-0">
                    <div className="relative aspect-square w-full overflow-hidden">
                        {product.discount > 0 && (
                            <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2 py-1 text-sm font-bold uppercase tracking-wider text-primary-foreground">
                                -{product.discount}%
                            </span>
                        )}

                        {isInCart && (
                            <Badge className="absolute right-3 top-3 z-10 gap-1 bg-success/90 hover:bg-success text-[10px] font-bold uppercase py-1 shadow-sm border-none">
                                <ShoppingCart className="h-3 w-3" />
                                {t('inCart')}
                            </Badge>
                        )}
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            unoptimized
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold uppercase tracking-wider text-primary">
                            {product.brand?.name || ""}
                        </span>
                        {product.category?.name && (
                            <>
                                <span className="flex-shrink-0 text-xs text-muted-foreground">
                                    •
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {product.category.name}
                                </span>
                            </>
                        )}
                    </div>
                    <CardTitle className="mt-2 line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                        {product.name}
                    </CardTitle>
                    <div className="mt-auto flex items-baseline gap-2 flex-wrap pt-2">
                        <span className="text-lg font-bold text-primary sm:text-xl">
                            {formatCurrency(discountedPrice)}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-xs font-medium text-muted-foreground line-through sm:text-sm">
                                {formatCurrency(product.price)}
                            </span>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                    <div className="flex items-center gap-1 text-warning">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold text-foreground">
                            {averageRating.toFixed(1)}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
