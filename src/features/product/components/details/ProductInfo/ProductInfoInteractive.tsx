"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { ProductDetail } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateCart } from "@/features/cart/hooks/useCart";
import { AlertLogin } from "@/features/product/components";
import { useAuthStore, useCheckoutStore } from "@/store";
import { CheckoutItem } from "@/features/checkout/types/checkout";
import { AddToCartRequest } from "@/features/cart/types";
import { ShoppingCart, Zap, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductInfoInteractiveProps {
  product: ProductDetail;
}



/**
 * Component button để chọn size - hiển thị cả size hết hàng
 */
const SizeButton = ({
  size,
  stock,
  isSelected,
  onSelect,
}: {
  size: string;
  stock: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isOutOfStock = stock <= 0;

  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="outline"
        className="h-10 min-w-[3.5rem] px-2 rounded-xl border border-border bg-border text-muted-foreground opacity-50 cursor-not-allowed line-through text-sm"
      >
        {size}
      </Button>
    );
  }

  if (isSelected) {
    return (
      <Button
        onClick={onSelect}
        variant="outline"
        className="h-10 min-w-[3.5rem] px-2 rounded-xl border-2 border-primary bg-primary/10 text-primary font-bold text-sm hover:shadow-md"
      >
        {size}
      </Button>
    );
  }

  return (
    <Button
      onClick={onSelect}
      variant="outline"
      className="h-10 min-w-[3.5rem] px-2 rounded-xl border-2 border-border text-foreground font-medium text-sm bg-card"
    >
      {size}
    </Button>
  );
};

/**
 * Component chính để tương tác với sản phẩm: chọn variant, số lượng, thêm vào giỏ, mua ngay
 */
export default function ProductInfoInteractive({
  product,
}: ProductInfoInteractiveProps) {
  const t = useTranslations('Products.details');
  const router = useRouter();
  const { user } = useAuthStore();
  const setCheckout = useCheckoutStore((state) => state.setCheckout);
  const { mutate: createCart } = useCreateCart();
  const { variants, listImg, product: productInfo } = product;

  // Tìm variant đầu tiên có size còn hàng
  const firstAvailableVariant = useMemo(() => {
    for (const variant of variants) {
      const inStockSize = variant.sizes.find((size) => size.stock > 0);
      if (inStockSize) return { variant, size: inStockSize };
    }
    return null;
  }, [variants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    firstAvailableVariant?.variant.id || variants[0]?.id || ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    firstAvailableVariant?.size.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Tìm variant và size đã chọn
  const selectedData = useMemo(() => {
    const variant = variants.find((v) => v.id === selectedVariantId);
    if (!variant) return null;

    const size = variant.sizes.find((s) => s.id === selectedSizeId && s.stock > 0);
    if (size) return { variant, size };

    // Nếu size đã chọn hết hàng, tìm size đầu tiên còn hàng
    const firstInStock = variant.sizes.find((s) => s.stock > 0);
    if (firstInStock) {
      setSelectedSizeId(firstInStock.id);
      return { variant, size: firstInStock };
    }

    return null;
  }, [variants, selectedVariantId, selectedSizeId]);

  const stock = selectedData?.size.stock || 0;
  const canPurchase = !!selectedData && stock > 0 && quantity > 0;
  const maxQuantity = Math.min(stock, 10); // Giới hạn tối đa 10 sản phẩm

  // Tính giá sau giảm
  const discountPercent = productInfo.discount || 0;
  const discountedPrice = discountPercent > 0
    ? productInfo.price - (productInfo.price * discountPercent) / 100
    : productInfo.price;

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    if (!canPurchase || !selectedData) return;
    createCart({ variantSizeId: selectedSizeId, quantity } as AddToCartRequest);
  };

  const handleBuy = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    if (!canPurchase || !selectedData) return;

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

    setCheckout([checkoutItem], 'product');
    router.push('/checkout');
  };

  if (variants.length === 0 || !firstAvailableVariant) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <span className="inline-block text-sm font-bold text-destructive-foreground uppercase bg-destructive px-3 py-1.5 rounded-md">
          {t('outOfStock')}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Variants and Sizes Selection */}
      <div className="flex flex-col gap-6">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;

          return (
            <div key={variant.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-bold text-sm uppercase",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}>
                  {variant.color.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {variant.sizes.map((size) => (
                  <SizeButton
                    key={size.id}
                    size={size.size}
                    stock={size.stock}
                    isSelected={isSelected && selectedSizeId === size.id}
                    onSelect={() => {
                      if (size.stock > 0) {
                        setSelectedVariantId(variant.id);
                        setSelectedSizeId(size.id);
                        setQuantity(1); // Reset quantity khi đổi size
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Info and Quantity Selector */}
      {selectedData && (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{t('remaining')} </span>
            <span className="font-bold">
              {stock} {t('items')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm uppercase text-muted-foreground">{t('quantity')}</span>
            <div className="flex items-center gap-2 border-2 border-border rounded-xl">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                variant="ghost"
                size="icon"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-bold text-foreground">{quantity}</span>
              <Button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                variant="ghost"
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={!canPurchase}
            className="flex-1 border-2 border-primary bg-transparent text-primary hover:bg-primary/5 font-bold text-lg h-14 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('addToCart')}
          </Button>
          <Button
            onClick={handleBuy}
            disabled={!canPurchase}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {t('buyNow')}
          </Button>
        </div>
      </div>

      <AlertLogin open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}
