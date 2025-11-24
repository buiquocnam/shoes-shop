import type { Metadata } from 'next';
import { VerifyOtp } from '@/features/auth/components';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getOtpData } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Verify OTP - ShoeShop',
    description: 'Verify your email with OTP code',
};

export default async function VerifyOtpPage() {
    const otpData = await getOtpData();
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner className="size-8" /></div>}>
            <VerifyOtp email={otpData!.email} status={otpData!.status} />
        </Suspense>
    );
}
