"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailType } from "../../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateCart } from "@/features/cart/hooks/useCart";
import { AlertLogin } from "@/features/product/components";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckoutItem } from "@/features/checkout/types/checkout";
import { setCheckoutItems } from "@/features/checkout/utils/checkoutStorage";
import { AddToCartRequest } from "@/features/cart/types";

import { Input } from "@/components/ui/input";

interface ProductInfoInteractiveProps {
  product: ProductDetailType;
}


const QuantitySelector = ({
  quantity,
  setQuantity,
  maxStock,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  maxStock: number;
}) => (
  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full max-w-[140px] bg-white">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      disabled={maxStock <= 0}
      className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium hover:bg-gray-100"
      aria-label="Decrease quantity"
    >
      −
    </Button>

    <Input
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      className="w-10 h-full text-center border-none shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
      min={1}
      max={maxStock}
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
      disabled={quantity >= maxStock || maxStock <= 0}
      className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium hover:bg-gray-100"
      aria-label="Increase quantity"
    >
      +
    </Button>
  </div>
);

/**
 * Component button để chọn size variant
 */
const VariantButton = ({
  size,
  stock,
  isSelected,
  onSelect,
}: {
  size: string;
  stock: number;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <Button
    variant="outline"
    size="sm"
    className={cn(
      "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all duration-200 text-xs sm:text-sm font-semibold",
      isSelected && "bg-red-700 text-white border-red-700 shadow-md hover:bg-red-800",
      !isSelected &&
      stock > 0 &&
      "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-red-400 hover:shadow-sm",
      stock <= 0 &&
      "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
    )}
    onClick={onSelect}
    disabled={stock <= 0}
    title={stock > 0 ? `Size ${size} - Stock: ${stock}` : "Out of Stock"}
    aria-label={`Select size ${size}${stock > 0 ? ` (${stock} available)` : " (out of stock)"}`}
  >
    {size}
  </Button>
);

/**
 * Component chính để tương tác với sản phẩm: chọn variant, số lượng, thêm vào giỏ, mua ngay
 */
export default function ProductInfoInteractive({
  product,
}: ProductInfoInteractiveProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { mutate: createCart } = useCreateCart();
  const { variants, listImg, product: productInfo } = product;

  const firstInStockSizeId = useMemo(() => {
    for (const variant of variants) {
      const inStockSize = variant.sizes.find((size) => size.stock > 0);
      if (inStockSize) return inStockSize.id;
    }
    return variants[0]?.sizes[0]?.id || "";
  }, [variants]);

  const [selectedSizeId, setSelectedSizeId] = useState<string>(firstInStockSizeId);
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Tìm variant và size đã chọn từ selectedSizeId
  const selectedData = useMemo(() => {
    for (const variant of variants) {
      const size = variant.sizes.find((s) => s.id === selectedSizeId);
      if (size) return { variant, size };
    }
    return null;
  }, [variants, selectedSizeId]);

  const stock = selectedData?.size.stock || 0;
  const canPurchase = !!selectedData && stock > 0 && quantity > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    if (!canPurchase || !selectedData) return;
    console.log(selectedData);
    createCart({ varianSizeId: selectedSizeId, quantity } as AddToCartRequest);
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    if (!canPurchase || !selectedData) return;

    const discountPercent = productInfo.discount || 0;
    const discountedPrice = productInfo.price - (productInfo.price * discountPercent) / 100;
    const totalPrice = discountedPrice * quantity;

    const productImage = listImg?.find((img) => img.isPrimary)?.url || productInfo.imageUrl?.url || "";

    const checkoutItem: CheckoutItem = {
      product: {
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        discount: discountPercent,
        imageUrl: productImage,
      },
      variant: {
        id: selectedData.variant.id,
        color: selectedData.variant.color,
      },
      size: {
        id: selectedData.size.id,
        size: selectedData.size.size,
      },
      quantity: quantity,
      totalPrice: totalPrice,
    };

    setCheckoutItems([checkoutItem], 'product');
    router.push('/checkout');
  };

  if (variants.length === 0) {
    return (
      <div className="mb-4 sm:mb-6">
        <span className="inline-block text-xs sm:text-lg font-bold text-white uppercase bg-red-500 px-4 py-2 rounded-md">
          Out of Stock
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 sm:mb-6 space-y-3">
        {variants.map((variant) => (
          <div key={variant.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: variant.color }}
                aria-label={`Color: ${variant.color}`}
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {variant.color}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap ml-8">
              {variant.sizes.map((size) => (
                <VariantButton
                  key={size.id}
                  size={size.size}
                  stock={size.stock}
                  isSelected={selectedSizeId === size.id}
                  onSelect={() => setSelectedSizeId(size.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
        {selectedData && (
          <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-2 text-red-700">
            {stock} {stock === 1 ? 'item' : 'items'} left in stock
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              maxStock={stock}
            />
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handleAddToCart}
            disabled={!canPurchase}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-2.5 rounded-md text-sm sm:text-base text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 hover:bg-red-800"
          >
            Add to Cart
          </Button>

          <Button
            variant="outline"
            size="lg"
            disabled={!canPurchase}
            onClick={handleBuy}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-2.5 rounded-md text-sm sm:text-base font-bold transition-all duration-200 border-2 border-red-700 text-red-700 hover:bg-red-50 hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </Button>
        </div>
      </div>

      <AlertLogin open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}
