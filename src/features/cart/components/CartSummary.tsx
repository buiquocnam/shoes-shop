'use client';

import { CartResponse } from '@/features/cart/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckoutStore } from '@/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CheckoutItem } from '@/features/checkout';

interface CartSummaryProps {
    cart: CartResponse;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();
    const setCheckout = useCheckoutStore((state) => state.setCheckout);

    // Calculate totals
    const originalTotal = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    const discountedTotal = cart.items.reduce((sum, item) => {
        const discountPercent = item.product.discount || 0;
        const discountedPrice = item.product.price - (item.product.price * discountPercent) / 100;
        return sum + (discountedPrice * item.quantity);
    }, 0);

    const totalDiscount = originalTotal - discountedTotal;

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

        setCheckout(checkoutItems, 'cart');
        router.push('/checkout');
    };

    return (
        <div className="sticky top-24 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-4">
                Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-sm font-medium">Giá gốc tổng cộng</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(originalTotal)}
                    </span>
                </div>
                {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="text-sm font-medium">Tổng giảm giá</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            -{formatCurrency(totalDiscount)}
                        </span>
                    </div>
                )}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        Tổng thanh toán
                    </span>
                    <div className="text-right">
                        <span className="text-3xl font-extrabold text-primary block leading-none">
                            {formatCurrency(discountedTotal)}
                        </span>
                    </div>
                </div>
            </div>
            <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                disabled={cart.count === 0}
            >
                Tiến hành thanh toán
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link
                href="/products"
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors mt-6 group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Tiếp tục mua sắm
            </Link>
        </div>
    );
}
