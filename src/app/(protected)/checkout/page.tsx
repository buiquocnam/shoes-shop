'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
    const router = useRouter();
    const checkoutItems = useCheckoutStore((state) => state.items);

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-4">Không có sản phẩm nào để thanh toán</p>
                        <Button
                            variant="default"
                            onClick={() => router.push('/products')}
                            className="hover:underline"
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <CheckoutForm orderSummary={checkoutItems} />
            </div>
        </div>
    );
}
