import { Star } from "lucide-react";
import { ProductDetail } from "@/types/product";
import { formatCurrency } from "@/utils/format";
import ProductInfoInteractive from "./ProductInfoInteractive";

interface ProductInfoProps {
    product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { product: productInfo } = product;

    const originalPrice = productInfo.price;
    const discountPercent = productInfo.discount || 0;
    const discountedPrice = discountPercent > 0
        ? originalPrice - (originalPrice * discountPercent) / 100
        : originalPrice;

    return (
        <div className="flex flex-col gap-6 bg-card rounded-xl shadow-lg p-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
                    {productInfo.name}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        {productInfo.brand?.name || "Thương hiệu"}
                    </span>
                    {productInfo.category?.name && (
                        <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm">
                                {productInfo.category.name}
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center text-warning text-sm font-medium mb-4">
                    <Star className="w-[18px] h-[18px] fill-current" />
                    <span className="text-foreground ml-1">
                        {productInfo.averageRating?.toFixed(1) || "0.0"} ({productInfo.countSell || 0} đánh giá)
                    </span>
                </div>
                <p className="text-muted-foreground">
                    {productInfo.description || "Không có mô tả"}
                </p>
            </div>

            <div className="flex items-end gap-3 pb-6 border-b border-border">
                <span className="text-4xl font-extrabold text-primary">
                    {formatCurrency(discountedPrice)}
                </span>
                {discountPercent > 0 && (
                    <span className="text-lg text-muted-foreground line-through mb-1.5 font-medium">
                        {formatCurrency(originalPrice)}
                    </span>
                )}
            </div>

            {/* Interactive Section */}
            <ProductInfoInteractive product={product} />
        </div>
    );
}
