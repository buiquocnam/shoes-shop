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
                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sản phẩm ({cart.count})</span>
                            <span className="font-semibold">{formatCurrency(cart.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Vận chuyển</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">Miễn phí</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Tổng cộng</span>
                        <span className="text-2xl font-bold">{formatCurrency(cart.totalPrice)}</span>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full h-12"
                        size="lg"
                        disabled={cart.count === 0}
                    >
                        Tiến hành thanh toán
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        Bạn sẽ không bị tính phí cho đến bước tiếp theo
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}



