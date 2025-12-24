'use client';

import { CartType } from '@/features/cart/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';

interface CartItemProps {
    item: CartType;
    updateQuantity: (id: string, size: number, delta: number) => void;
    remove: (id: string) => void;
}

export function CartItem({ item, updateQuantity, remove }: CartItemProps) {
    const router = useRouter();

    const discountedPrice =
        item.product.price - (item.product.price * (item.product.discount || 0)) / 100;
    const itemTotal = discountedPrice * item.quantity;

    const handleProductClick = () => {
        router.push(`/products/${item.product.id}`);
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="col-span-6 flex items-center gap-6 w-full">
                <div
                    className="relative size-28 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-100 transition-colors hover:border-primary border border-transparent"
                    onClick={handleProductClick}
                >
                    <Image
                        src={item.product.imageUrl?.url || '/images/no-image.png'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-contain p-2"
                        sizes="112px"
                    />
                </div>
                <div>
                    <h3 
                        className="text-lg font-bold cursor-pointer hover:text-primary transition-colors"
                        onClick={handleProductClick}
                    >
                        {item.product.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {item.variant.color} • Size {item.variant.sizeLabel}
                    </p>
                </div>
            </div>
            <div className="col-span-3 flex justify-center">
                <div className="flex items-center border border-slate-200 rounded-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-none border-r border-slate-200"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Number(item.variant.sizeLabel), 1)}
                        disabled={item.quantity >= item.variant.stock}
                        className="w-8 h-8 rounded-none border-l border-slate-200"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="col-span-2 text-right font-extrabold text-lg">
                {formatCurrency(itemTotal)}
            </div>
            <div className="col-span-1 flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(item.id)}
                    className="text-slate-400 hover:text-red-500 h-9 w-9"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

