"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductDetailType, ProductType, ProductVariant } from "../../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateCart } from "@/features/cart/hooks/useCart";
import { AlertLogin } from "@/features/product/components";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { CheckoutItem } from "@/features/checkout/types";

const QuantitySelector = ({
  quantity,
  setQuantity,
  isInStock,
  stock,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  isInStock: boolean;
  stock: number;
}) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full max-w-[140px] bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        disabled={quantity <= 1 || !isInStock}
        className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium"
      >
        −{" "}
      </Button>{" "}
      <span className="flex-1 text-center text-xs sm:text-sm font-semibold text-gray-800">
        {quantity}{" "}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
        disabled={quantity >= stock || !isInStock}
        className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium"
      >
        +{" "}
      </Button>{" "}
    </div>
  );
};

interface ProductInfoInteractiveProps {
  product: ProductDetailType;
}

export default function ProductInfoInteractive({
  product,
}: ProductInfoInteractiveProps) {
  const { variants, listImg, product: productInfo } = product;
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const { mutate: createCart } = useCreateCart();
  const { isAuthenticated } = useAuthStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  // --- Available colors & sizes ---
  const availableColors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Sizes for selected color
  const availableSizesForColor = useMemo(() => {
    if (!selectedColor) return [];
    return Array.from(
      new Set(
        variants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size?.label)
          .filter(Boolean)
      )
    );
  }, [selectedColor, variants]);

  // Set default size when color changes
  useEffect(() => {
    setSelectedSize(availableSizesForColor[0] || null);
    setQuantity(1);
  }, [availableSizesForColor]);

  // Current variant
  const currentVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(
      (v) => v.color === selectedColor && v.size?.label === selectedSize
    );
  }, [selectedColor, selectedSize, variants]);

  const isInStock = !!currentVariant?.stock;
  const isReadyForPurchase = !!currentVariant && isInStock && quantity > 0;

  const handleAddToCart = () => {
    if (!currentVariant) return;
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    createCart({ variantId: currentVariant.id, quantity });
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    if (!currentVariant) return;

    // Create checkout item with product, variant, and quantity
    const checkoutItem: CheckoutItem = {
      product: {
        id: productInfo.id,
        name: productInfo.name,
        imageUrl: listImg[0]?.url || '',
        price: productInfo.price,
      },
      variant: {
        id: currentVariant.id,
        size: currentVariant.size?.label || currentVariant.sizeLabel || '',
        color: currentVariant.color,
        quantity: quantity,
      },
    };

    // Encode and pass via URL
    const itemsParam = encodeURIComponent(JSON.stringify([checkoutItem]));
    router.push(`/checkout?items=${itemsParam}`);
  };

  return variants.length === 0 ? (
    <>
      <div className="mb-4 sm:mb-6">
        <span className="text-xs sm:text-lg font-bold text-gray-800 uppercase mb-2 bg-red-500 text-white p-2 rounded-md">
          Out of Stock
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="mb-4 sm:mb-6">
        <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase mb-2 block">
          Color
        </span>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color;
            const colorStock = variants
              .filter((v: ProductVariant) => v.color === color)
              .reduce((sum: number, v: ProductVariant) => sum + (v.stock || 0), 0);
            const hasStock = colorStock > 0;

            return (
              <Button
                key={color}
                variant="outline"
                size="icon"
                style={{ backgroundColor: color }}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition shadow-sm",
                  isSelected &&
                  "ring-2 ring-offset-2 ring-red-500 border-white scale-105",
                  !isSelected &&
                  hasStock &&
                  "border-gray-300 hover:border-red-400",
                  !hasStock && "opacity-40 !cursor-not-allowed border-gray-300"
                )}
                onClick={() => hasStock && setSelectedColor(color)}
                title={!hasStock ? "Out of Stock" : color}
              />
            );
          })}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-4 sm:mb-6">
        <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase mb-2 block">
          Size
        </span>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {availableSizesForColor.map((size) => {
            const sizeStock = variants
              .filter(
                (v) => v.color === selectedColor && v.size?.label === size
              )
              .reduce((sum, v) => sum + (v.stock || 0), 0);
            const isSelected = selectedSize === size;
            const isSizeInStock = sizeStock > 0;

            return (
              <Button
                key={size}
                variant="outline"
                size="sm"
                className={cn(
                  "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition duration-200 text-xs sm:text-sm font-semibold",
                  isSelected
                    ? "bg-red-700 text-white border-red-700 shadow-md"
                    : isSizeInStock
                      ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-red-400"
                      : "bg-gray-100 text-gray-400 border-gray-200 !cursor-not-allowed opacity-60"
                )}
                onClick={() => isSizeInStock && setSelectedSize(size)}
                title={
                  !isSizeInStock
                    ? "Out of Stock"
                    : `${size} - Stock: ${sizeStock}`
                }
              >
                {size}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Quantity + Actions */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
        {selectedSize && (
          <p
            className={cn(
              "text-xs sm:text-sm font-medium mb-3 sm:mb-2",
              isInStock ? "text-red-700" : "text-red-500"
            )}
          >
            {isInStock
              ? `${currentVariant?.stock} left in stock for selected size`
              : "Out of stock for selected size"}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <QuantitySelector
              stock={currentVariant?.stock || 0}
              quantity={quantity}
              setQuantity={setQuantity}
              isInStock={isInStock}
            />
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handleAddToCart}
            disabled={!isReadyForPurchase}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-2.5 rounded-md text-sm sm:text-base text-white font-bold transition duration-200 shadow-lg"
          >
            Add to Cart
          </Button>

          <Button
            variant="outline"
            size="lg"
            disabled={!isReadyForPurchase}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-2.5 rounded-md text-sm sm:text-base font-bold transition duration-200 border-2"
            onClick={handleBuy}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <AlertLogin open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}
