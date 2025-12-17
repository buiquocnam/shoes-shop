import { StarIcon } from "lucide-react";
import { ProductDetailType } from "../../types";
import { formatCurrency } from "@/utils/format";
import ProductInfoInteractive from "./ProductInfoInteractive";

interface ProductInfoProps {
    product: ProductDetailType;
}

export default function ProductInfo({ product }: ProductInfoProps) {

    const { product: productInfo } = product;
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-1">
                {productInfo.name}
            </h1>

            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${index < Math.floor(Number(productInfo.averageRating || 0))
                                ? "text-red-500 fill-red-500"
                                : "text-gray-300 fill-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl lg:text-3xl text-red-700 font-extrabold">
                    {formatCurrency(productInfo.price)}
                </span>
                {productInfo.discount > 0 && (
                    <span className="text-base sm:text-lg lg:text-xl text-gray-400 line-through">
                        {formatCurrency(productInfo.price)}
                    </span>
                )}
            </div>

            <ProductInfoInteractive product={product} />

            <div className="mt-4 sm:mt-6">
                <h2 className="text-base sm:text-lg font-bold uppercase text-gray-900 mb-2 sm:mb-3">
                    Description
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {productInfo.description}
                </p>
            </div>
        </div>
    );
}

