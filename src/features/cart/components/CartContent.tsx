'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCartStore } from '@/store/useCartStore';

export function CartContent() {
    const cart = useCartStore((state) => state.cart);
    const isLoading = useCartStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return <CartEmpty />;
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                <p className="text-gray-600">Review your items and proceed to checkout</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <CartList items={cart.items} />
                </div>

                {/* Cart Summary - Takes 1 column on large screens, sticky */}
                <div className="lg:col-span-1">
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

