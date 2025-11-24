'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckoutForm } from '@/features/checkout';
import { CheckoutItem } from '@/features/checkout/types';
import { mockShippingAddresses, mockShippingMethods as defaultShippingMethods } from '@/features/checkout/constants/mockData';

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get checkout items from searchParams
    const checkoutItems: CheckoutItem[] = useMemo(() => {
        const itemsParam = searchParams?.get('items');
        if (itemsParam) {
            try {
                return JSON.parse(decodeURIComponent(itemsParam));
            } catch {
                return [];
            }
        }
        return [];
    }, [searchParams]);

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-4">Không có sản phẩm nào để thanh toán</p>
                        <button
                            onClick={() => router.push('/products')}
                            className="text-primary hover:underline"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <CheckoutForm
                    initialAddresses={mockShippingAddresses}
                    shippingMethods={defaultShippingMethods}
                    orderSummary={checkoutItems}
                />
            </div>
        </div>
    );
}