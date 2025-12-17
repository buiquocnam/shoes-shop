'use client';

import { CartResponse } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { CheckoutItem } from '@/features/checkout/types/checkout';
import { setCheckoutItems } from '@/features/checkout/utils/checkoutStorage';

interface CartSummaryProps {
    cart: CartResponse;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

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
        <div className="sticky top-4">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items ({cart.count})</span>
                            <span className="font-semibold">{formatCurrency(cart.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold">{formatCurrency(cart.totalPrice)}</span>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full h-12"
                        size="lg"
                        disabled={cart.count === 0}
                    >
                        Proceed to Checkout
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        You won't be charged until the next step
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}



