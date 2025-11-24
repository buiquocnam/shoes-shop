'use client';

import { CartResponse, CartType } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Input

} from '@/components/ui/input';
interface CartSummaryProps {
    cart: CartResponse;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    const handleCheckout = () => {
        // Convert cart items to checkout items format
        const checkoutItems = cart.items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                imageUrl: item.product.imageUrl?.url || '',
                price: item.product.price,
            },
            variant: {
                id: item.variant.id,
                size: item.variant.size?.label || '',
                color: item.variant.color,
            },
        }));

        // Pass checkout items via URL searchParams
        const itemsParam = encodeURIComponent(JSON.stringify(checkoutItems));
        router.push(`/checkout?items=${itemsParam}`);
    };

    return (

        <div className="flex justify-between items-center mt-10">
            <div className="flex items-center ">
                <Input type="text" placeholder="Enter coupon code" className="rounded-none" />
                <Button variant="outline" className="rounded-none bg-[#1a365d] text-white hover:bg-[#1a365d]/90 hover:text-white">Apply</Button>
            </div>

            <div className="sticky top-4 min-w-md ">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Items ({cart.count})</span>
                            <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Cupon</span>
                            <span className="font-medium text-red-600">No</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-700">
                                {formatCurrency(cart.totalPrice)}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full bg-[#1a365d] text-white hover:bg-[#1a365d]/90 h-12 text-base font-semibold"
                        disabled={cart.count === 0}
                    >
                        Proceed to Checkout
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        You won't be charged until the next step
                    </p>
                </div>
            </div>
        </div>

    );
}



