import { Star, ShoppingBag, Truck } from "lucide-react";
import { ProductDetailType } from "../../types";
import { formatCurrency } from "@/utils/format";
import ProductInfoInteractive from "./ProductInfoInteractive";

interface ProductInfoProps {
    product: ProductDetailType;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { product: productInfo } = product;
    
    const originalPrice = productInfo.price;
    const discountPercent = productInfo.discount || 0;
    const discountedPrice = discountPercent > 0 
        ? originalPrice - (originalPrice * discountPercent) / 100 
        : originalPrice;

    return (
        <div className="flex flex-col gap-4">
            {/* Product Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <ShoppingBag className="w-24 h-24 text-primary transform rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-serif lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            {productInfo.name}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={index}
                                    className={`w-4 h-4 ${
                                        index < Math.floor(Number(productInfo.averageRating || 0))
                                            ? "fill-current"
                                            : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            ({productInfo.countSell || 0} đánh giá)
                        </span>
                    </div>

                    <div className="flex items-end gap-3 pb-3  dark:border-gray-700">
                        <span className="text-3xl font-black text-primary">
                            {formatCurrency(discountedPrice)}
                        </span>
                        {discountPercent > 0 && (
                            <>
                                <span className="text-base text-gray-600 dark:text-gray-400 line-through mb-1 font-medium">
                                    {formatCurrency(originalPrice)}
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-white mb-1 shadow-sm shadow-primary/30">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                   
                </div>
            </div>

            {/* Interactive Section */}
            <ProductInfoInteractive product={product} />
        </div>
    );
}

