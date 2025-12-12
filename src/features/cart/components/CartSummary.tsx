'use client';

import { CartResponse } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { CheckoutItem } from '@/features/checkout/types';
import { setCheckoutItems } from '@/features/checkout/utils/checkoutStorage';

interface CartSummaryProps {
    cart: CartResponse;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    /**
     * Convert cart items to checkout items format và lưu vào sessionStorage
     * Format giống ProductInfoInteractive - không có variantId ở đầu
     */
    const handleCheckout = () => {
        const checkoutItems: CheckoutItem[] = cart.items.map((item) => {
            // Tính giá sau discount
            const discountPercent = item.product.discount || 0;
            const discountedPrice = item.product.price - (item.product.price * discountPercent) / 100;
            const totalPrice = discountedPrice * item.quantity;


            // Tạo checkout item với thông tin sản phẩm đầy đủ (không có variantId, quantity, totalPrice ở đầu)
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
        console.log(checkoutItems);

        // Lưu vào sessionStorage
        setCheckoutItems(checkoutItems);
        router.push('/checkout');
    };

    return (
        <div className="sticky top-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

                <div className="space-y-3">
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600">Items ({cart.count})</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(cart.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-green-600">Free</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatCurrency(cart.totalPrice)}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold rounded-lg"
                    disabled={cart.count === 0}
                >
                    Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-500 text-center">
                    You won't be charged until the next step
                </p>
            </div>
        </div>
    );
}



