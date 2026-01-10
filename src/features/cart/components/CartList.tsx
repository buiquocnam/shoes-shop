'use client';

import { CartType } from '@/features/cart/types';
import { CartItem } from './CartItem';

interface CartListProps {
    items: CartType[];
    updateQuantity: (id: string, size: number, delta: number) => void;
    remove: (id: string) => void;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
}

export function CartList({
    items,
    updateQuantity,
    remove,
    selectedIds,
    toggleSelection
}: CartListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header row - hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-bold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-1 border-r border-border/50"></div>
                <div className="col-span-5 pl-4">Chi tiết sản phẩm</div>
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
                    isSelected={selectedIds.includes(item.id)}
                    onToggle={() => toggleSelection(item.id)}
                />
            ))}
        </div>
    );
}



