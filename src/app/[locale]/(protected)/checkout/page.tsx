'use client';

import { useCheckoutStore } from '@/store';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CheckoutPage() {
    const t = useTranslations('Checkout');
    const tCart = useTranslations('Cart');
    const checkoutItems = useCheckoutStore((state) => state.items);

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-4">{t('noItems')}</p>
                        <Button
                            asChild
                            variant="default"
                            className="hover:underline"
                        >
                            <Link href="/products">
                                {tCart('continueShopping')}
                            </Link>
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
