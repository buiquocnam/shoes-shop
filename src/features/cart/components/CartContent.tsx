'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCartStore } from '@/store/useCartStore';
import { Spinner } from '@/components/ui/spinner';

export function CartContent() {
    const cart = useCartStore((state) => state.cart);
    const isLoading = useCartStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return <CartEmpty />;
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
                <p className="text-muted-foreground">Review your items and proceed to checkout</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CartList items={cart.items} />
                </div>

                <div className="lg:col-span-1">
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

