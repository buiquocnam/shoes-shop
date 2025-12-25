'use client';

import { CartType } from '@/features/cart/types';
import { CartItem } from './CartItem';

interface CartListProps {
    items: CartType[];
    updateQuantity: (id: string, size: number, delta: number) => void;
    remove: (id: string) => void;
}

export function CartList({ items, updateQuantity, remove }: CartListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header row - hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <div className="col-span-6 pl-2">Chi tiết sản phẩm</div>
                <div className="col-span-3 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Giá</div>
                <div className="col-span-1 text-center"></div>
            </div>
            
            {/* Cart items */}
            {items.map((item) => (
                <CartItem 
                    key={item.id} 
                    item={item}
                    updateQuantity={updateQuantity}
                    remove={remove}
                />
            ))}
        </div>
    );
}



