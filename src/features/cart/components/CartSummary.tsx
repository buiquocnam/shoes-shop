'use client';

import { CartResponse } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { CheckoutItem } from '@/features/checkout/types/checkout';
import { setCheckoutItems } from '@/features/checkout/utils/checkoutStorage';

interface CartSummaryProps {
    cart: CartResponse;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    const subtotal = cart.totalPrice;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handleCheckout = () => {
        const checkoutItems: CheckoutItem[] = cart.items.map((item) => {
            const discountPercent = item.product.discount || 0;
            const discountedPrice = item.product.price - (item.product.price * discountPercent) / 100;
            const totalPrice = discountedPrice * item.quantity;

            return {
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    discount: discountPercent,
                    imageUrl: item.product.imageUrl?.url || null,
                },
                variant: {
                    id: item.variant.id,
                    color: item.variant.color,
                },
                size: {
                    id: item.variant.id,
                    size: item.variant.sizeLabel,
                },
                quantity: item.quantity,
                totalPrice: totalPrice,
            };
        });

        setCheckoutItems(checkoutItems, 'cart');
        router.push('/checkout');
    };

    return (
        <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span className="text-sm">Shipping</span>
                    <span className="font-bold text-primary">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span className="text-sm">Estimated Tax</span>
                    <span className="font-bold">{formatCurrency(tax)}</span>
                </div>
            </div>
            <div className="border-t pt-6 mb-8 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-extrabold text-primary">{formatCurrency(total)}</span>
            </div>
            <Button
                onClick={handleCheckout}
                className="w-full bg-primary text-center text-white font-extrabold text-lg py-4 rounded-xl shadow-lg hover:shadow-primary/50 transition-all"
                disabled={cart.count === 0}
            >
                Checkout Now
            </Button>
        </div>
    );
}



