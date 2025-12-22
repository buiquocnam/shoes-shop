'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2 } from 'lucide-react';

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
  const [orderId, setOrderId] = useState<string | null>(null);

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
        onSuccess: (response) => {
          const id = response?.orderId;
          if (id) {
            setOrderId(id);
          } 
          sessionStorage.removeItem('checkoutData');

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

  if (isPending) {
    return (
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-lg font-semibold text-text-main dark:text-white">Đang xử lý đơn hàng...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={() => {
              if (orderId) {
                router.push(`/checkout/success/${orderId}`);
              } else {
                router.push('/profile/orders');
              }
            }}
          >
            Xem chi tiết đơn hàng
          </Button>
          <Button 
            size="lg" 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => router.push('/products')}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </main>
  );
}
