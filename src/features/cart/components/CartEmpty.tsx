'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function CartEmpty() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button
                onClick={() => router.push('/')}
                className="bg-[#1a365d] text-white hover:bg-[#1a365d]/90"
            >
                Continue Shopping
            </Button>
        </div>
    );
}

























