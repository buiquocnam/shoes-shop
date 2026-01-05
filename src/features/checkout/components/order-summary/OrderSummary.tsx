'use client';

import { useState, useMemo } from 'react';
import { CheckoutItem } from '../../types/checkout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { Lock } from 'lucide-react';
import { OrderRow, DiscountSection } from '.';
import { Coupon } from '../../types/coupon';

interface OrderSummaryProps {
    orderSummary: CheckoutItem[];
    onCheckout: (coupon: Coupon | null, totalAmount: number) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function OrderSummary({
    orderSummary,
    onCheckout,
    isLoading = false,
    disabled = false,
}: OrderSummaryProps) {
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const subtotal = useMemo(
        () => orderSummary.reduce((acc, item) => acc + item.totalPrice, 0),
        [orderSummary]
    );

    const discountAmount = useMemo(() => {
        if (!selectedCoupon) return 0;
        return (subtotal * selectedCoupon.discountPercent) / 100;
    }, [subtotal, selectedCoupon]);

    const total = subtotal - discountAmount;

    const handleSetDiscountCode = (coupon: Coupon | null) => {
        setSelectedCoupon(coupon);
    };

    const handleCheckout = () => {
        onCheckout(selectedCoupon, Math.round(total));
    };

    return (
        <Card className="sticky top-8 border-none shadow-md">
            <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {orderSummary.map((item) => (
                        <OrderRow key={`${item.variant.id}-${item.size.id}`} item={item} />
                    ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tạm tính</span>
                    <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                <DiscountSection price={subtotal} setDiscountCode={handleSetDiscountCode} />

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                </div>

                <Button
                    onClick={handleCheckout}
                    disabled={isLoading || orderSummary.length === 0 || disabled}
                    className="h-12 w-full gap-2"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-4 w-4" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="h-4 w-4" />
                            <span>Thanh toán ngay</span>
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}


