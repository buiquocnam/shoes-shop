'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

import { CheckoutItem, CreateOrderRequest } from '@/features/checkout/types/checkout';
import { AddressType } from '@/features/shared/types/address';
import { formatCurrency } from '@/utils/format';
import { formatFullAddress } from '@/features/shared/utils/addressHelpers';
import { useCreateOrder } from '@/features/checkout/hooks/useCheckout';

interface CheckoutData {
  orderSummary: CheckoutItem[];
  selectedAddress: AddressType;
  totalAmount: number;
  couponCode: string | null;
  totalMoney?: number;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔒 đảm bảo createOrder chỉ chạy 1 lần duy nhất
  const hasCreatedOrderRef = useRef(false);

  useEffect(() => {
    if (hasCreatedOrderRef.current) return;

    const storedData = sessionStorage.getItem('checkoutData');

    if (!storedData) {
      // Không có data → quay lại checkout
      router.replace('/checkout');
      return;
    }

    const data: CheckoutData = JSON.parse(storedData);
   

    setCheckoutData(data);

    const orderRequest: CreateOrderRequest = {
      items: data.orderSummary.map((item: CheckoutItem) => ({
        variantSizeId: item.size.id,
        quantity: item.quantity,
      })),
      couponCode: data.couponCode,
      addressId: data.selectedAddress.id,
    };

    hasCreatedOrderRef.current = true;

    createOrder(
      {
        request: orderRequest,
        orderSummary: data.orderSummary,
        selectedAddress: data.selectedAddress,
      },
      {
        onError: (err: any) => {
          setError(err?.message || 'Không thể tạo đơn hàng');
        },
        onSuccess: () => {
          sessionStorage.removeItem('checkoutData');
        },
      }
    );
  }, [createOrder, router]);

  // ===== Loading =====
  if (isPending || !checkoutData) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-lg font-semibold">Đang tạo đơn hàng...</p>
          <p className="text-sm text-muted-foreground">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </main>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-destructive">{error}</p>
          <Button onClick={() => router.replace('/checkout')}>
            Quay lại checkout
          </Button>
        </div>
      </main>
    );
  }

  const totalAmount =
    checkoutData.totalMoney ?? checkoutData.totalAmount;

  // ===== Success UI =====
  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-12 w-12" />
            <h1 className="text-3xl lg:text-4xl">
              Thank you for your purchase!
            </h1>
          </div>

          <p className="mb-10 text-lg">
            Your order has been placed successfully.
          </p>

          <div className="w-full overflow-hidden rounded-xl border">
            {/* Address */}
            <div className="border-b p-6 text-left">
              <p className="mb-2 text-xs font-bold uppercase">
                Shipping Address
              </p>
              <p className="font-semibold">
                {formatFullAddress(checkoutData.selectedAddress)}
              </p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-4 p-6 text-left">
              {checkoutData.orderSummary.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}-${item.size.id}`}
                  className="flex items-center gap-4"
                >
                  <div
                    className="aspect-square w-16 rounded-md border bg-cover bg-center"
                    style={{
                      backgroundImage: item.product.imageUrl
                        ? `url('${item.product.imageUrl}')`
                        : undefined,
                    }}
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm">
                      Size: {item.size.size} / Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t p-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/profile/orders">View Orders</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
