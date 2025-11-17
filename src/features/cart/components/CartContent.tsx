'use client';

import { CartList } from './CartList';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { useCart }  from '@/features/cart/hooks/useCart';
import { useCartStore } from '@/store/useCartStore';
export function CartContent() {
    // const { cart, isLoading } = useCart();

    useCart()   
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
        <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase" >Shopping Cart</h1>
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
                <CartList items={cart.items} />
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
                <CartSummary cart={cart} />
            </div>
        </div>
    );
}

