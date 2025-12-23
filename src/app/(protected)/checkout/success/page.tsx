'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { CreateOrderRequest } from '@/features/checkout/types/checkout';
import { checkoutApi } from '@/features/checkout/services/checkout.api';
import { getCheckoutSource, clearCheckoutItems } from '@/features/checkout/utils/checkoutStorage';
import { clearCart as clearCartApi } from '@/features/cart/services';
import { useCartStore } from '@/store/useCartStore';
import { userQueryKeys } from '@/features/shared/constants/user-queryKeys';

interface CheckoutData {
  orderSummary: any[];
  selectedAddress: any;
  totalAmount: number;
  couponCode: string | null;
  totalMoney?: number;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart: clearCartStore, setCart } = useCartStore();
  const hasCreatedOrderRef = useRef(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window === 'undefined') return;
    if (hasCreatedOrderRef.current) return;

    const storedData = sessionStorage.getItem('checkoutData');

    if (!storedData) {
      router.replace('/checkout');
      return;
    }

    const checkoutData: CheckoutData = JSON.parse(storedData);

    const orderRequest: CreateOrderRequest = {
      items: checkoutData.orderSummary.map((item: any) => ({
        variantSizeId: item.size.id,
        quantity: item.quantity,
      })),
      couponCode: checkoutData.couponCode,
      addressId: checkoutData.selectedAddress.id,
    };

    hasCreatedOrderRef.current = true;

    const checkoutSource = getCheckoutSource();
    const source = checkoutSource === "cart" ? "cart" : "buy-now";

    checkoutApi
      .createOrder(orderRequest)
      .then(async (response) => {
        const id = response?.orderId;
        if (id) {
          setOrderId(id);
        }

        // Cleanup logic
        try {
          clearCheckoutItems();
          sessionStorage.removeItem('checkoutData');

          if (source === "cart") {
            try {
              await clearCartApi();
              clearCartStore();
              setCart(null);
              queryClient.removeQueries({
                queryKey: userQueryKeys.cart.current(),
              });
            } catch (err) {
              // Silently handle cart cleanup errors
            }
          }
          
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Không thể tạo đơn hàng';
        setError(errorMessage);
        setIsLoading(false);
        toast.error(errorMessage);
      });
  }, [router, queryClient, clearCartStore, setCart]);

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

  // Show loading if still loading
  if (isLoading) {
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
    <main className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
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
