'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { OrderSummary } from './order-summary/OrderSummary';
import { CheckoutItem } from '../types/checkout';
import { useVnPayPayment, useCreateOrder } from '../hooks/useCheckout';
import { AddressManagement } from '@/features/address/components/AddressManagement';
import { useAuthStore } from '@/store/useAuthStore';
import { useUsersAddress } from '@/features/address/hooks/useAddress';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Coupon } from '../types/coupon';
import { useCheckoutStore } from '@/store';
import { useTranslations } from 'next-intl';

interface CheckoutFormProps {
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({ orderSummary }: CheckoutFormProps) {
    const t = useTranslations('Checkout');
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
                toast.error(t('selectAddress'));
                return;
            }

            if (orderSummary.length === 0) {
                toast.error(t('noItems'));
                return;
            }

            const orderItems = orderSummary.map(item => ({
                variantSizeId: item.size.id,
                quantity: item.quantity
            }));

            setIsNavigating(true);

            // Save details to store for success/fallback
            useCheckoutStore.getState().setCheckoutDetails({
                addressId: selectedAddress.id,
                couponCode: coupon?.code || null,
                totalAmount,
            });

            createOrder({
                request: {
                    items: orderItems,
                    couponCode: coupon?.code || null,
                    addressId: selectedAddress.id
                }
            }, {
                onSuccess: (data) => {
                    // Save orderId in store
                    useCheckoutStore.getState().setCheckoutDetails({ orderId: data.orderId });

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
        [orderSummary, createVnPayPayment, selectedAddress, t]
    );

    const showLoading = isPending || isNavigating;
    if (showLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-20">
                <Spinner className="h-10 w-10 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t('processing')}</h2>
                <p className="text-muted-foreground text-sm">{t('wait')}</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
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
