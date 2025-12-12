'use client';

import { useCallback, useState, useEffect } from 'react';
import { OrderSummary } from './CheckoutFormComponents/OrderSummary';
import { CheckoutItem } from '../types';
import { useCreateOrder } from '../hooks/useCheckout';
import { AddressManagement } from '@/features/shared/components/address';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressType } from '@/features/shared/types/address';
import { useUsersAddress } from '@/features/shared/hooks/useAdress';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface CheckoutFormProps {
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({ orderSummary }: CheckoutFormProps) {
    const { mutate: createOrder, isPending } = useCreateOrder();
    const { user } = useAuthStore();
    const userId = user?.id ?? "";
    const { data: usersAddress, isLoading: isLoadingAddress } = useUsersAddress(userId);
    const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set default address khi data load xong - ưu tiên address có isDefault
    useEffect(() => {
        if (usersAddress && usersAddress.length > 0) {
            const defaultAddr = usersAddress.find((addr) => addr.isDefault) || usersAddress[0];
            setSelectedAddress(defaultAddr);
        } else {
            setSelectedAddress(null);
        }
    }, [usersAddress]);




    /**
     * Xử lý checkout - gửi order lên server
     */
    const handleCheckout = useCallback(async () => {
        // Validate: phải có address mới được checkout
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        setIsSubmitting(true);
        createOrder({
            request: {
                items: orderSummary.map((item) => ({
                    variantSizeId: item.size.id,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                })),
                couponCode: null,
            },
            orderSummary,
            selectedAddress, // Đảm bảo không null
        });
    }, [orderSummary, createOrder, selectedAddress]);

    // Reset isSubmitting khi component unmount (navigate xong)
    useEffect(() => {
        return () => {
            setIsSubmitting(false);
        };
    }, []);

    // Hiển thị loading khi đang pending hoặc đang submit
    const showLoading = isPending || isSubmitting;

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

            {/* Left section: Shipping Address */}
            <div className="w-full lg:w-3/5">
                <AddressManagement
                    userId={userId}
                    usersAddress={usersAddress ?? []}
                    isLoading={isLoadingAddress}
                    selectedAddress={selectedAddress}
                />
            </div>

            {/* Right section: Order Summary */}
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

