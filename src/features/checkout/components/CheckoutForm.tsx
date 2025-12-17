'use client';

import { useCallback, useState, useEffect } from 'react';
import { OrderSummary } from './CheckoutFormComponents/OrderSummary';
import { CheckoutItem } from '../types/checkout';
import { useCreateOrder } from '../hooks/useCheckout';
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
    const { mutate: createOrder, isPending, isError } = useCreateOrder();
    const { user } = useAuthStore();
    const userId = user?.id ?? '';
    const { data: usersAddress, isLoading: isLoadingAddress } = useUsersAddress(userId);
    const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (usersAddress && usersAddress.length > 0) {
            const defaultAddr = usersAddress.find((addr) => addr.isDefault) || usersAddress[0];
            setSelectedAddress(defaultAddr);
        } else {
            setSelectedAddress(null);
        }
    }, [usersAddress]);

    useEffect(() => {
        if (isError && isNavigating) {
            setIsNavigating(false);
        }
    }, [isError, isNavigating]);

    const handleCheckout = useCallback(
        (coupon: Coupon | null) => {
            if (!selectedAddress) {
                toast.error('Vui lòng chọn địa chỉ giao hàng');
                return;
            }

            setIsNavigating(true);
            createOrder({
                request: {
                    items: orderSummary.map((item) => ({
                        variantSizeId: item.size.id,
                        quantity: item.quantity,
                    })),
                    couponCode: coupon?.code || null,
                },
                orderSummary,
                selectedAddress,
            });
        },
        [orderSummary, createOrder, selectedAddress]
    );

    const showLoading = isPending || isNavigating;

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

