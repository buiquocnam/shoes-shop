import { Suspense } from 'react';
import { CartContent } from '@/features/cart/components/CartContent';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Cart' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default function CartPage() {
    const tCommon = useTranslations('Common');

    return (
        <div className="min-h-screen bg-background">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <Spinner className="h-8 w-8 text-primary" />
                            <p className="text-muted-foreground">{tCommon('loading')}</p>
                        </div>
                    </div>
                }
            >
                <CartContent />
            </Suspense>
        </div>
    );
}