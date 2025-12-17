'use client';

import { useCallback, useState, useEffect } from 'react';
import { OrderSummary } from './CheckoutFormComponents/OrderSummary';
import { CheckoutItem } from '../types/checkout';
import { useVnPayPayment } from '../hooks/useCheckout';
import { AddressManagement } from '@/features/shared/components/address';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressType } from '@/features/shared/types/address';
import { useUsersAddress } from '@/features/shared/hooks/useAdress';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Coupon } from '../types/coupon';

interface CheckoutFormProps {
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({ orderSummary }: CheckoutFormProps) {
    const { mutate: createVnPayPayment, isPending } = useVnPayPayment();
    const { user } = useAuthStore();
    const userId = user?.id ?? '';
    const { data: usersAddress, isLoading: isLoadingAddress } = useUsersAddress(userId);
    const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);

    useEffect(() => {
        if (usersAddress && usersAddress.length > 0) {
            const defaultAddr = usersAddress.find((addr) => addr.isDefault) || usersAddress[0];
            setSelectedAddress(defaultAddr);
        } else {
            setSelectedAddress(null);
        }
    }, [usersAddress]);

    const handleCheckout = useCallback(
        (coupon: Coupon | null, totalAmount: number) => {
            if (!selectedAddress) {
                toast.error('Vui lòng chọn địa chỉ giao hàng');
                return;
            }

            if (orderSummary.length === 0) {
                toast.error('Không có sản phẩm nào để thanh toán');
                return;
            }

            // Get first item's variantSizeId
            // Note: If multiple items, you may need to handle payment for each item separately
            const firstItem = orderSummary[0];
            const variantSizeId = firstItem.size.id;

            createVnPayPayment({
                amount: totalAmount,
                bankCode: 'NCB',
                variantSizeId,
            });
        },
        [orderSummary, createVnPayPayment, selectedAddress]
    );

    const showLoading = isPending;

    return (
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {showLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-lg font-semibold">Đang xử lý đơn hàng...</p>
                        <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            )}

            <div className="w-full lg:w-3/5">
                <AddressManagement
                    userId={userId}
                    usersAddress={usersAddress ?? []}
                    isLoading={isLoadingAddress}
                    selectedAddress={selectedAddress}
                />
            </div>

            <div className="w-full lg:w-2/5 lg:sticky lg:top-8 lg:self-start">
                <OrderSummary
                    orderSummary={orderSummary}
                    onCheckout={handleCheckout}
                    isLoading={isPending || isLoadingAddress}
                    disabled={!selectedAddress || isPending}
                />
            </div>
        </div>
    );
}

