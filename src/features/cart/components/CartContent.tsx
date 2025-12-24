'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCartStore } from '@/store/useCartStore';
import { Spinner } from '@/components/ui/spinner';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';

export function CartContent() {
    const cart = useCartStore((state) => state.cart);
    const isLoading = useCartStore((state) => state.isLoading);
    const { mutate: updateItem } = useUpdateCartItem();
    const { mutate: removeItem } = useRemoveCartItem();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return <CartEmpty />;
    }

    const handleUpdateQuantity = (id: string, size: number, delta: number) => {
        const item = cart.items.find(i => i.id === id);
        if (!item) return;
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1 || newQuantity > item.variant.stock) return;
        updateItem({ itemId: id, quantity: newQuantity });
    };

    const handleRemove = (id: string) => {
        removeItem(id);
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-12">
            <h1 className="text-4xl font-extrabold uppercase italic mb-8">
                Your <span className="text-primary">Cart</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                    <CartList 
                        items={cart.items} 
                        updateQuantity={handleUpdateQuantity}
                        remove={handleRemove}
                    />
                </div>
                <div className="lg:col-span-4">
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

