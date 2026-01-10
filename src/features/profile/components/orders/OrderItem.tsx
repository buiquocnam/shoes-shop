'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PurchasedProduct } from '@/features/profile/types';
import { formatCurrency } from '@/utils/format';

interface OrderItemProps {
  purchasedItem: PurchasedProduct;
}

export function OrderItem({ purchasedItem }: OrderItemProps) {
  const router = useRouter();
  const imageUrl = purchasedItem.product.imageUrl?.url || '/images/no-image.png';
  const brandName = purchasedItem.product.brand?.name || '';
  const originalPrice = purchasedItem.product.price;
  const discount = purchasedItem.product.discount || 0;
  const hasDiscount = discount > 0;

  console.log("purchasedItem", purchasedItem
  );
  const handleProductClick = () => {
    router.push(`/products/${purchasedItem.product.id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 border-b border-border last:border-0">
      <div className="shrink-0">
        <div
          className="relative size-24 rounded-lg bg-background border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleProductClick}
        >
          <Image
            src={imageUrl}
            alt={purchasedItem.product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {brandName && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {brandName}
              </span>
            </div>
          )}
          <h4
            className="font-bold text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={handleProductClick}
          >
            {purchasedItem.product.name}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{purchasedItem.variant.color}</span>
            <span className="size-1 rounded-full bg-muted-foreground/30"></span>
            <span>{purchasedItem.variant.size}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end justify-center gap-1 min-w-[140px] text-left sm:text-right border-t sm:border-t-0 border-dashed border-border pt-3 sm:pt-0 mt-2 sm:mt-0">
        <div className="text-sm text-muted-foreground">x{purchasedItem.countBuy}</div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-lg text-primary">
            {formatCurrency(purchasedItem.totalMoney)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/40">
              {formatCurrency(originalPrice * purchasedItem.countBuy)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
