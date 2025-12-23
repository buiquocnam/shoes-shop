"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailType } from "../../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateCart } from "@/features/cart/hooks/useCart";
import { AlertLogin } from "@/features/product/components";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { CheckoutItem } from "@/features/checkout/types/checkout";
import { setCheckoutItems } from "@/features/checkout/utils/checkoutStorage";
import { AddToCartRequest } from "@/features/cart/types";
import { Minus, Plus, Check, Ruler, ShoppingCart, Zap, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  <div className="flex items-center border border-input rounded-lg overflow-hidden bg-background w-fit shadow-sm">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      disabled={maxStock <= 0}
      className="h-8 w-8 rounded-none"
      aria-label="Giảm số lượng"
    >
      <Minus className="w-4 h-4" />
    </Button>

    <Input
      type="text"
      value={quantity}
      onChange={(e) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= 1 && val <= maxStock) {
          setQuantity(val);
        }
      }}
      className="w-10 text-center border-none font-inter text-foreground bg-transparent font-bold text-sm"
      min={1}
      max={maxStock}
    />
    
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
      disabled={quantity >= maxStock || maxStock <= 0}
      className="h-8 w-8 rounded-none"
      aria-label="Tăng số lượng"
    >
      <Plus className="w-4 h-4" />
    </Button>
  </div>
);

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
        variant="outline"
        size="sm"
        disabled
        className="px-3 py-1.5 text-xs font-medium rounded-lg border-dashed opacity-50 cursor-not-allowed"
      >
        {size}
      </Button>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={onSelect}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-lg",
        isSelected && "font-bold shadow-md shadow-primary/30"
      )}
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
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
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

  // Tính giá sau giảm
  const discountPercent = productInfo.discount || 0;
  const discountedPrice = discountPercent > 0 
    ? productInfo.price - (productInfo.price * discountPercent) / 100 
    : productInfo.price;
  const totalPrice = discountedPrice * quantity;

  // Khi đổi variant, tự động chọn size đầu tiên còn hàng
  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const variant = variants.find((v) => v.id === variantId);
    const firstInStock = variant?.sizes.find((s) => s.stock > 0);
    if (firstInStock) {
      setSelectedSizeId(firstInStock.id);
    }
  };

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

  if (variants.length === 0 || !firstAvailableVariant) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <span className="inline-block text-sm font-bold text-primary-foreground uppercase bg-destructive px-3 py-1.5 rounded-md">
          Hết hàng
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Variants and Sizes Selection */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Tuỳ chọn
          </h3>

        <div className="space-y-4">
          {variants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;
            const hasAvailableSizes = variant.sizes.some((s) => s.stock > 0);
            const selectedSize = variant.sizes.find((s) => s.id === selectedSizeId);
            
            return (
              <div
                key={variant.id}
                className={cn(
                  "flex items-start gap-4 p-3 rounded-2xl transition-colors border",
                  isSelected
                    ? "hover:bg-accent border-border"
                    : "hover:bg-accent/50 border-transparent opacity-80 hover:opacity-100"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border shadow-sm flex items-center justify-center",
                      isSelected
                        ? "bg-primary border-border ring-2 ring-offset-2 ring-primary"
                        : "bg-background border-border"
                    )}
                    style={isSelected ? {} : { backgroundColor: variant.color }}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className={cn(
                    "text-xs text-center mt-1 font-semibold",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {variant.color}
                  </div>
                </div>
                
                <div className="flex-grow">
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
                          }
                        }}
                      />
                    ))}
                  </div>
                  {isSelected && selectedSize && selectedSize.stock > 0 && (
                    <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Size {selectedSize.size} còn hàng
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="pt-4 mt-2 border-t border-border">
          <div className="flex items-center gap-4 mb-4">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              maxStock={stock}
            />
            <div className="flex-1">
              <Button
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className="w-full py-2.5 px-4 text-sm font-bold rounded-xl shadow-lg shadow-primary/30"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ - {formatCurrency(totalPrice)}
              </Button>
            </div>
          </div>
          <Button
            onClick={handleBuy}
            disabled={!canPurchase}
            variant="outline"
            className="w-full py-2.5 px-4 text-sm font-bold rounded-xl border-2 border-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Mua ngay
          </Button>
        </div>
      </div>

      {/* Product Description Accordion */}
        <Accordion type="single" collapsible defaultValue="description" className="w-full bg-white  border border-gray-100 shadow-lg rounded-2xl">
          <AccordionItem value="description" className="border-none ">
            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent">
              <span className="uppercase tracking-wider flex items-center gap-2 text-xs font-bold">
                <FileText className="w-4 h-4 text-primary" />
                Mô tả sản phẩm
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="text-muted-foreground text-sm leading-relaxed">
                <p className="mb-4 whitespace-pre-line">
                  {productInfo.description || "Không có mô tả cho sản phẩm này."}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      <AlertLogin open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}
