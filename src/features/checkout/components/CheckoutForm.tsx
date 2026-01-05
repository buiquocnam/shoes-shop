'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { OrderSummary } from './order-summary/OrderSummary';
import { CheckoutItem } from '../types/checkout';
import { useVnPayPayment, useCreateOrder } from '../hooks/useCheckout';
import { AddressManagement } from '@/features/shared/components/address';
import { useAuthStore } from '@/store/useAuthStore';
import { useUsersAddress } from '@/features/shared/hooks/useAdress';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Coupon } from '../types/coupon';

interface CheckoutFormProps {
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({ orderSummary }: CheckoutFormProps) {
    const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
    const { mutate: createVnPayPayment, isPending: isPaymentPending, isError } = useVnPayPayment();
    const isPending = isCreatingOrder || isPaymentPending;
    const { user } = useAuthStore();
    const userId = user?.id ?? '';
    const { data: usersAddress, isLoading: isLoadingAddress } = useUsersAddress(userId);
    const [isNavigating, setIsNavigating] = useState(false);

    // Get default address
    const selectedAddress = useMemo(() => {
        if (!usersAddress || usersAddress.length === 0) return null;
        return usersAddress.find((addr) => addr.isDefault) || null;
    }, [usersAddress]);


    useEffect(() => {
        if (isError && isNavigating) {
            setIsNavigating(false);
        }
    }, [isError, isNavigating]);

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

            sessionStorage.setItem(
                "checkoutData",
                JSON.stringify({
                    orderSummary,
                    selectedAddress,
                    totalAmount,
                    totalMoney: totalAmount,
                    couponCode: coupon?.code || null,
                })
            );

            const orderItems = orderSummary.map(item => ({
                variantSizeId: item.size.id,
                quantity: item.quantity
            }));

            setIsNavigating(true);

            createOrder({
                request: {
                    items: orderItems,
                    couponCode: coupon?.code || null,
                    addressId: selectedAddress.id
                }
            }, {
                onSuccess: (data) => {
                    createVnPayPayment({
                        amount: totalAmount,
                        bankCode: 'NCB',
                        orderId: data.orderId,
                    });
                },
                onError: () => {
                    setIsNavigating(false);
                }
            });
        },
        [orderSummary, createVnPayPayment, selectedAddress]
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
                <AddressManagement userId={userId} />
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
