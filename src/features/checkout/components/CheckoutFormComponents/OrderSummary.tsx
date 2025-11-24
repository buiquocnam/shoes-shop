'use client';

import { useMemo } from 'react';
import { CheckoutItem } from '../../types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/utils/format';
import { Lock } from 'lucide-react';
import { OrderItem, PriceBreakdown, DiscountSection } from './OrderSummaryComponents';

interface OrderSummaryProps {
    orderSummary: CheckoutItem[];
    onCheckout: () => void;
    onApplyDiscount: (code: string) => void;
    isLoading?: boolean;
}

export function OrderSummary({
    orderSummary,
    onCheckout,
    onApplyDiscount,
    isLoading = false,
}: OrderSummaryProps) {
    const { subtotal, shipping, discount, total, priceSummary } = useMemo(() => {
        const subtotal = orderSummary.reduce(
            (acc, item) => acc + (item.product?.price || 0) * (item.variant?.quantity || 1),
            0
        );
        const shipping = 0;
        const discount = 0;
        const total = subtotal + shipping - discount;

        return {
            subtotal,
            shipping,
            discount,
            total,
            priceSummary: {
                subtotal,
                shipping,
                discount,
            },
        };
    }, [orderSummary]);

    return (
        <div className="sticky top-8 rounded-lg border bg-secondary p-6">
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>

                <div className="flex flex-col gap-4">
                    {orderSummary.map((item) => (
                        <OrderItem key={item.variant?.id} item={item} />
                    ))}
                </div>

                <PriceBreakdown priceSummary={priceSummary} />

                <DiscountSection
                    onApplyDiscount={onApplyDiscount}
                    isApplying={isLoading}
                />

                <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-lg font-bold">Tổng cộng</p>
                    <p className="text-2xl font-black">{formatCurrency(total)}</p>
                </div>

                <Button
                    onClick={onCheckout}
                    type="button"
                    disabled={isLoading || orderSummary.length === 0}
                    className="flex h-14 w-full items-center justify-center gap-2 text-base font-bold"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="h-5 w-5" />
                            <span>Thanh toán ngay</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}


