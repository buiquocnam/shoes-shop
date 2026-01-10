import type { Metadata } from 'next';
import { VerifyOtp } from '@/features/auth/components';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getOtpData } from '@/lib/auth';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth.otp' });
    return {
        title: `${t('title')} - ShoeShop`,
        description: t('description'),
    };
}

export default async function VerifyOtpPage() {
    const otpData = await getOtpData();
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner className="size-8" /></div>}>
            <VerifyOtp email={otpData!.email} status={otpData!.status} />
        </Suspense>
    );
}
