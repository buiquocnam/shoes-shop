'use client';

import { CartType } from '@/features/cart/types';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
    item: CartType;
    updateQuantity: (id: string, size: number, delta: number) => void;
    remove: (id: string) => void;
}

export function CartItem({ item, updateQuantity, remove }: CartItemProps) {
    const router = useRouter();

    const originalPrice = item.product.price;
    const discountPercent = item.product.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
    const itemTotal = discountedPrice * item.quantity;

    const handleProductClick = () => {
        router.push(`/products/${item.product.id}`);
    };

    return (
        <div className="group flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-4 items-center p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:border-primary/30 transition-all">
            <div className="col-span-6 w-full flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                    <Image
                        src={item.product.imageUrl?.url || '/images/no-image.png'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                        sizes="112px"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 
                        className="text-lg font-bold text-slate-900 dark:text-white leading-tight cursor-pointer hover:text-primary transition-colors"
                        onClick={handleProductClick}
                    >
                        {item.product.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Phân loại: {item.variant.color}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Kích cỡ: {item.variant.sizeLabel} (EU)
                    </p>
                    <div className="md:hidden mt-2 flex items-center gap-2">
                        <span className="font-extrabold text-primary text-lg">
                            {formatCurrency(itemTotal)}
                        </span>
                        {discountPercent > 0 && (
                            <span className="text-sm text-slate-400 line-through font-medium">
                                {formatCurrency(originalPrice * item.quantity)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-3 w-full flex flex-col items-center justify-center md:justify-center">
                <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                    <button
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center border-none bg-transparent p-0 text-sm font-bold text-slate-900 dark:text-white focus:ring-0"
                    />
                    <button
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), 1)}
                        disabled={item.quantity >= item.variant.stock}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                    Còn lại: {item.variant.stock}
                </span>
            </div>
            <div className="col-span-2 w-full text-center md:text-right hidden md:flex flex-col items-end justify-center">
                <span className="text-lg font-extrabold text-primary">
                    {formatCurrency(itemTotal)}
                </span>
                {discountPercent > 0 && (
                    <span className="text-sm font-medium text-slate-400 line-through">
                        {formatCurrency(originalPrice * item.quantity)}
                    </span>
                )}
            </div>
            <div className="col-span-1 w-full flex justify-center md:justify-end">
                <button
                    onClick={() => remove(item.id)}
                    className="size-10 flex items-center justify-center rounded-full text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all"
                    title="Xóa sản phẩm"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

