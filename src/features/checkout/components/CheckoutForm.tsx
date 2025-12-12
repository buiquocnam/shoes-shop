'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { OrderSummary } from './CheckoutFormComponents/OrderSummary';
import { CheckoutItem } from '../types';
import { useCreateOrder } from '../hooks/useCheckout';
import { ShippingAddress } from './CheckoutFormComponents/ShippingAddress';
import { AddressType } from '@/features/shared/types/address';

interface CheckoutFormProps {
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({ orderSummary }: CheckoutFormProps) {
    const createOrderMutation = useCreateOrder();
    const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);

    /**
     * Xử lý checkout - gửi order lên server
     */
    const handleCheckout = useCallback(async () => {
        if (!orderSummary?.length) {
            toast.error('Không có sản phẩm nào để thanh toán');
            return;
        }

        await createOrderMutation.mutateAsync(orderSummary);
    }, [orderSummary, createOrderMutation]);

    const handleSelectAddress = (address: AddressType) => {
        setSelectedAddress(address);
    };

    return (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Left section: Shipping Address */}
            <div className="w-full lg:w-3/5">
                <ShippingAddress
                    selectedAddressId={selectedAddress?.id}
                    onSelectAddress={handleSelectAddress}
                />
            </div>

            {/* Right section: Order Summary */}
            <div className="w-full lg:w-2/5 lg:sticky lg:top-8 lg:self-start">
                <OrderSummary
                    orderSummary={orderSummary}
                    onCheckout={handleCheckout}
                    isLoading={createOrderMutation.isPending}
                />
            </div>
        </div>
    );
}

