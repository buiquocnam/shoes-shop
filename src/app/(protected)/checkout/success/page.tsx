'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { CheckoutItem } from '@/features/checkout/types/checkout';
import { formatCurrency } from '@/utils/format';
import { AddressType } from '@/features/shared/types/address';
import { formatFullAddress } from '@/features/shared/utils/addressHelpers';

interface CheckoutSuccessData {
    orderSummary: CheckoutItem[];
    totalMoney: number;
    selectedAddress: AddressType | null;
}

export default function CheckoutSuccessPage() {
    const router = useRouter();

    const getInitialData = (): CheckoutSuccessData | null => {
        if (typeof window === "undefined") return null;

        const storedData = sessionStorage.getItem('checkoutSuccessData');
        if (!storedData) return null;

        try {
            return JSON.parse(storedData) as CheckoutSuccessData;
        } catch (error) {
            console.error('Error parsing checkout success data:', error);
            return null;
        }
    };

    const successData = getInitialData();

    useEffect(() => {
        // Nếu không có data, redirect về checkout
        if (!successData) {
            router.push('/checkout');
        }
    }, [successData, router]);

    // Nếu không có data, không render gì (đang redirect)
    if (!successData) {
        return null;
    }

    const totalAmount =
        typeof successData.totalMoney === 'number'
            ? successData.totalMoney
            : Array.isArray(successData.orderSummary)
                ? successData.orderSummary.reduce((sum, item) => sum + item.totalPrice, 0)
                : 0;

    return (
        <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="container mx-auto px-4 py-12 lg:px-8">
                <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                    <div className="flex items-center align-center gap-2 text-primary">
                        <CheckCircle2 className="h-12 w-12 " />
                        <h1 className="mb-3 text-3xl lg:text-4xl">
                            Thank You for Your Purchase!
                        </h1>
                    </div>
                    <p className="mb-10 text-lg ">
                        Your order has been placed successfully.
                    </p>

                    {/* Order Details Card */}
                    <div className="w-full overflow-hidden rounded-xl border ">
                        {/* Shipping Address */}
                        {successData.selectedAddress && (
                            <div className="border-b p-6">
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase  mb-2">
                                        Shipping Address
                                    </p>
                                    <p className="font-semibold text-foreground">
                                        {formatFullAddress(successData.selectedAddress)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="flex flex-col gap-4 p-6 text-left">
                            {Array.isArray(successData.orderSummary) && successData.orderSummary.length > 0 ? (
                                successData.orderSummary.map((item) => (
                                    <div key={`${item.product.id}-${item.variant.id}-${item.size.id}`} className="flex items-center gap-4">
                                        <div
                                            className="aspect-square w-16 flex-shrink-0 rounded-md bg-cover bg-center border"
                                            style={{
                                                backgroundImage: item.product.imageUrl ? `url('${item.product.imageUrl}')` : undefined,
                                                backgroundColor: item.product.imageUrl ? undefined : 'var(--muted)',
                                            }}
                                            aria-label={item.product.name}
                                        />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-foreground">{item.product.name}</p>
                                            <p className="text-sm ">
                                                Size: {item.size.size} / Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-foreground">
                                            {formatCurrency(item.totalPrice)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center ">
                                    No items found in this order.
                                </div>
                            )}
                        </div>

                        {/* Total Amount */}
                        <div className="bg-background p-6 border-t">
                            <div className="flex justify-between items-center">
                                <p className="text-base font-medium ">Total Amount</p>
                                <p className="text-xl font-black text-foreground">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/profile/orders">View Order Details</Link>
                        </Button>
                        <Button
                            size="lg"
                            className="w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
