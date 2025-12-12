'use client';

import { CartResponse } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
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
                    id: item.variant.sizes[0].id,
                    size: item.variant.sizes[0].size,
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



