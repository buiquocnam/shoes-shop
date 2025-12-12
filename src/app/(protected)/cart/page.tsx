import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CartContent } from '@/features/cart/components/CartContent';

export const metadata: Metadata = {
    title: 'Shopping Cart - Shoe Shop',
    description: 'Review your cart items and proceed to checkout',
};

export default function CartPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading cart...</p>
                        </div>
                    </div>
                }>
                    <CartContent />
                </Suspense>
            </div>
        </div>
    );
}    