'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { ShippingAddress } from './CheckoutFormComponents/ShippingAddress';
import { ShippingMethod } from './CheckoutFormComponents/ShippingMethod';
import { PaymentInfo } from './CheckoutFormComponents/PaymentInfo';
import { CheckoutHeader } from './CheckoutFormComponents/CheckoutHeader';
import { OrderSummary } from './CheckoutFormComponents/OrderSummary';
import {
    ShippingAddress as ShippingAddressType,
    ShippingMethod as ShippingMethodType,
    CheckoutItem,
    CreateOrderRequest
} from '../types';
import { useCreateOrder } from '../hooks/useCheckout';

interface CheckoutFormProps {
    initialAddresses?: ShippingAddressType[];
    shippingMethods: ShippingMethodType[];
    orderSummary: CheckoutItem[];
}

export function CheckoutForm({
    initialAddresses = [],
    shippingMethods,
    orderSummary,
}: CheckoutFormProps) {
    // State management
    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
        initialAddresses[0]?.id
    );
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string>(
        shippingMethods[0]?.id || ''
    );
    const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | undefined>();

    const createOrderMutation = useCreateOrder();

    // Transform checkout items to order request
    const transformToOrderRequest = useCallback((items: CheckoutItem[]): CreateOrderRequest[] => {
        return items.map((item) => {
          
            return {
                variantId: item.variant?.id || '',
                countBuy: item.variant?.quantity || 0,
                totalPrice: (item.product?.price || 0) * (item.variant?.quantity || 1),
            };
        });
    }, []);

    // Handle checkout
    const handleCheckout = useCallback(async () => {
        if (!orderSummary?.length) {
            toast.error('Không có sản phẩm nào để thanh toán');
            return;
        }

        try {
            const items = transformToOrderRequest(orderSummary);
            await createOrderMutation.mutateAsync(items);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra';
            toast.error(message);
            console.error('Checkout error:', error);
        }
    }, [orderSummary, transformToOrderRequest, createOrderMutation]);

    // Handle address selection
    const handleSelectAddress = useCallback((address: ShippingAddressType) => {
        setSelectedAddressId(address.id);
    }, []);

    // Handle shipping method selection
    const handleSelectShippingMethod = useCallback((methodId: string) => {
        setSelectedShippingMethodId(methodId);
    }, []);

    // Handle add new address (placeholder)
    const handleAddNewAddress = useCallback(() => {
        // TODO: Implement add new address functionality
        toast.info('Chức năng thêm địa chỉ đang được phát triển');
    }, []);

    // Handle apply discount
    const handleApplyDiscount = useCallback((code: string) => {
        // TODO: Implement discount code functionality
        if (code.trim()) {
            setAppliedDiscountCode(code);
            toast.info('Chức năng mã giảm giá đang được phát triển');
        }
    }, []);

    // Dummy payment info (not sent to backend)
    const dummyPaymentInfo = useMemo(() => ({
        method: 'credit_card' as const,
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardholderName: '',
    }), []);

    return (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Left section: Shipping & Payment Info */}
            <div className="w-full lg:w-3/5">
                <div className="flex flex-col gap-6">
                    <CheckoutHeader
                        title="Chi tiết giao hàng"
                        description="Hoàn tất đơn hàng bằng cách cung cấp các thông tin sau."
                    />

                    <div className="flex flex-col gap-4">
                        <ShippingAddress
                            addresses={initialAddresses}
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={handleSelectAddress}
                            onAddNewAddress={handleAddNewAddress}
                        />

                        <ShippingMethod
                            methods={shippingMethods}
                            selectedMethodId={selectedShippingMethodId}
                            onSelectMethod={handleSelectShippingMethod}
                        />

                        <PaymentInfo
                            paymentInfo={dummyPaymentInfo}
                            onPaymentInfoChange={() => {
                                // Payment info không cần gửi đi, chỉ để hiển thị
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Right section: Order Summary */}
            <div className="w-full lg:w-2/5">
                <OrderSummary
                    orderSummary={orderSummary}
                    onCheckout={handleCheckout}
                    onApplyDiscount={handleApplyDiscount}
                    isLoading={createOrderMutation.isPending}
                />
            </div>
        </div>
    );
}

