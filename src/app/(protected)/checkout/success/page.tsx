'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckoutStore } from '@/store';
import { clearCart as clearCartApi } from '@/features/cart/services';
import { userQueryKeys } from '@/features/shared/constants/user-queryKeys';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { items, orderId: storeOrderId, source } = useCheckoutStore();

  const orderId = storeOrderId || searchParams.get('orderId');

  useEffect(() => {
    if (!orderId && items.length === 0) {
      router.replace('/checkout');
      return;
    }

    if (source === 'cart') {
      clearCartApi().finally(() => {
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.cart.current(),
        });
      });
    }
  }, [orderId, items.length, source, router, queryClient]);

  if (!orderId && items.length === 0) return null;

  return (
    <main className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-center">
      <div className="flex flex-col items-center gap-6 max-w-md px-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Đặt hàng thành công!
          </h1>
          <p className="text-muted-foreground text-lg">
            Cảm ơn bạn đã tin tưởng và mua hàng tại Shoes Shop.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold"
            onClick={() => {
              if (orderId) {
                router.push(`/checkout/success/${orderId}`);
              } else {
                router.push('/profile/orders');
              }
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold bg-gray-900 hover:bg-gray-800 text-white"
            onClick={() => router.push('/products')}
          >
            Tiếp tục mua hàng
          </Button>
        </div>
      </div>
    </main>
  );
}
