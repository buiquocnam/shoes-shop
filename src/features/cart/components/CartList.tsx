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
        <>
            {items.map((item, idx) => (
                <CartItem 
                    key={item.id} 
                    item={item}
                    updateQuantity={updateQuantity}
                    remove={remove}
                />
            ))}
        </>
    );
}



