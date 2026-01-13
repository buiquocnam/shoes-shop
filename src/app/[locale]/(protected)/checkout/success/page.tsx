'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckoutStore } from '@/store';
import { userQueryKeys } from '@/constants/userQueryKeys';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { removeCartItem } from '@/features/cart/services';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function CheckoutSuccessPage() {
  const t = useTranslations('Checkout.success');
  const tProducts = useTranslations('Products');
  const tCommon = useTranslations('Common');
  const queryClient = useQueryClient();
  const { source, clearCheckout, _hasHydrated: checkoutHydrated } = useCheckoutStore();
  const { clearSelection, selectedItemIds, _hasHydrated: cartHydrated } = useCartStore();
  const [isCleaning, setIsCleaning] = useState(true);

  useEffect(() => {
    console.log("source",source)
    if (!checkoutHydrated || !cartHydrated) return;

    if (source === 'cart') {
      if (selectedItemIds.length === 0) {
        setIsCleaning(false);
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
          clearSelection();
          queryClient.invalidateQueries({
            queryKey: userQueryKeys.cart.current(),
          });
          clearCheckout();
        })
        .finally(() => {
          setIsCleaning(false);
        });
    } else {
      // If source is null or product, we don't clean cart
      setIsCleaning(false);
      clearCheckout();
    }
  }, [source, checkoutHydrated, cartHydrated, queryClient, clearCheckout, selectedItemIds, clearSelection]);



  if (isCleaning) {
    return (
      <main className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12 text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            {tCommon('loading') || "Đang xử lý..."}
          </p>
        </div>
      </main>
    );
  }

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
            asChild
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold"
          >
            <Link href="/profile/orders">
              {tCommon('detail')}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="flex-1 rounded-xl h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/products">
              {tProducts.rich('details.backToShopping', {
                br: () => <br />
              }) || "Tiếp tục mua hàng"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
