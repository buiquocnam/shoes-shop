'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { CreateOrderRequest } from '@/features/checkout/types/checkout';
import { useCreateOrder } from '@/features/checkout/hooks/useCheckout';

interface CheckoutData {
  orderSummary: any[];
  selectedAddress: any;
  totalAmount: number;
  couponCode: string | null;
  totalMoney?: number;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { mutate: createOrder, isPending, error } = useCreateOrder();
  const hasCreatedOrderRef = useRef(false);

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window === 'undefined') return;
    if (hasCreatedOrderRef.current) return;

    const storedData = sessionStorage.getItem('checkoutData');

    if (!storedData) {
      router.replace('/checkout');
      return;
    }

    const data: CheckoutData = JSON.parse(storedData);

    const orderRequest: CreateOrderRequest = {
      items: data.orderSummary.map((item: any) => ({
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
        onError: () => {
          // Error sẽ được hiển thị bên dưới
        },
        onSuccess: (response) => {
          const id = response?.orderId;
          if (id) {
            sessionStorage.removeItem('checkoutData');
            router.replace(`/checkout/success/${id}`);
          } else {
            sessionStorage.removeItem('checkoutData');
          }
        },
      }
    );
  }, [createOrder, router]);


  if (error) {
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Không thể tạo đơn hàng';

    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-destructive">{errorMessage}</p>
          <Button onClick={() => router.replace('/checkout')}>
            Quay lại checkout
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-lg font-semibold">
          {isPending ? 'Đang tạo đơn hàng...' : 'Đang chuyển hướng...'}
        </p>
        <p className="text-sm text-muted-foreground">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </main>
  );
}
