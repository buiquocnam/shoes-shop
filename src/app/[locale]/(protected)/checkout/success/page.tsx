'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckoutStore } from '@/store';
import { userQueryKeys } from '@/features/shared/constants/user-queryKeys';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { removeCartItem } from '@/features/cart/services';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutSuccessPage() {
  const t = useTranslations('Checkout.success');
  const tProducts = useTranslations('Products');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { items, orderId: storeOrderId, source } = useCheckoutStore();

  const orderId = storeOrderId;

  useEffect(() => {
    if (source === 'cart') {
      const selectedItemIds = useCartStore.getState().selectedItemIds;

      if (selectedItemIds.length === 0) {
        return;
      }

      const promises = selectedItemIds.map(itemId =>
        removeCartItem(itemId).catch(err => {
          console.error(`Failed to remove cart item ${itemId}:`, err);
          return null;
        })
      );


      Promise.all(promises)
        .then(() => {
          useCartStore.getState().clearSelection();

          queryClient.invalidateQueries({
            queryKey: userQueryKeys.cart.current(),
          });

          useCheckoutStore.getState().clearCheckout();
        })
        .catch(err => {
          console.error('Failed to cleanup cart after payment:', err);
          useCartStore.getState().clearSelection();
          useCheckoutStore.getState().clearCheckout();
        });
    }
  }, [orderId, source, router, queryClient]);

  if (!orderId && items.length === 0) return null;

  return (
    <main className="flex h-screen items-center justify-center bg-background text-center">
      <div className="flex flex-col items-center gap-6 max-w-md px-4 py-8">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold"
            onClick={() => {
              router.push(`/checkout/success/${orderId}` as any);
            }}
          >
            {tCommon('detail')}
          </Button>
          <Button
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push('/products' as any)}
          >
            {tProducts.rich('details.backToShopping', {
              br: () => <br />
            }) || "Tiếp tục mua hàng"}
          </Button>
        </div>
      </div>
    </main>
  );
}
