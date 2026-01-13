'use client';

import { CartType } from '@/features/cart/types';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CartItemProps {
    item: CartType;
    updateQuantity: (id: string, size: number, delta: number) => void;
    remove: (id: string) => void;
    isSelected: boolean;
    onToggle: () => void;
}

export function CartItem({ item, updateQuantity, remove, isSelected, onToggle }: CartItemProps) {
    const t = useTranslations('Cart');
    const router = useRouter();

    const originalPrice = item.product.price;
    const discountPercent = item.product.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
    const itemTotal = discountedPrice * item.quantity;

    const handleProductClick = () => {
        router.push(`/products/${item.product.id}`);
    };

    return (
        <div className={cn(
            "group flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-4 items-center p-4 bg-card rounded-2xl border transition-all duration-300",
            isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border shadow-sm hover:border-primary/30"
        )}>
            {/* Selection Checkbox */}
            <div className="md:col-span-1 w-full flex justify-start items-center md:justify-center border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggle}
                    className="size-6 rounded-md border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
            </div>

            <div className="col-span-5 w-full flex items-center gap-4">
                <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
                    <Image
                        src={item.product.imageUrl?.url || '/images/no-image.png'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 96px, 112px"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h3
                        className="text-base md:text-lg font-bold text-foreground leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2"
                        onClick={handleProductClick}
                    >
                        {item.product.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            {t('color')}: <span className="text-foreground">{item.variant.color}</span>
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            {t('size')}: <span className="text-foreground">{item.variant.sizeLabel} (EU)</span>
                        </p>
                    </div>
                    <div className="md:hidden mt-2 flex items-center gap-2">
                        <span className="font-extrabold text-primary text-lg">
                            {formatCurrency(itemTotal)}
                        </span>
                        {discountPercent > 0 && (
                            <span className="text-sm text-muted-foreground line-through font-medium">
                                {formatCurrency(originalPrice * item.quantity)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-3 w-full flex flex-col items-center justify-center">
                <div className="flex items-center border border-border rounded-lg bg-card shadow-sm">
                    <button
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent rounded-l-lg transition-colors disabled:opacity-50"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center border-none bg-transparent p-0 text-sm font-bold text-foreground focus:ring-0"
                    />
                    <button
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), 1)}
                        disabled={item.quantity >= item.variant.stock}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent rounded-r-lg transition-colors disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground font-bold mt-2 uppercase tracking-tight">
                    {t('remainingStatus')}: {item.variant.stock}
                </span>
            </div>

            <div className="col-span-2 w-full text-right hidden md:flex flex-col items-end justify-center">
                <span className="text-lg font-black text-primary">
                    {formatCurrency(itemTotal)}
                </span>
                {discountPercent > 0 && (
                    <span className="text-xs font-bold text-muted-foreground line-through opacity-70">
                        {formatCurrency(originalPrice * item.quantity)}
                    </span>
                )}
            </div>

            <div className="col-span-1 w-full flex justify-center md:justify-end">
                <button
                    onClick={() => remove(item.id)}
                    className="size-10 flex items-center justify-center rounded-full text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-110 transition-all active:scale-95"
                    title={t('removeTitle')}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

