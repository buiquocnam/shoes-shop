'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function CartEmpty() {
    const t = useTranslations('Cart');
    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">{t('empty')}</h1>
            <Button asChild className="bg-primary text-white px-8 py-3 rounded-full font-bold">
                <Link href="/products">{t('startShopping')}</Link>
            </Button>
        </div>
    );
}

































