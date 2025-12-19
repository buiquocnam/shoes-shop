import type { Metadata } from 'next';
import { VerifyOtp } from '@/features/auth/components';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getOtpData } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Xác thực OTP - ShoeShop',
    description: 'Xác thực email của bạn bằng mã OTP',
};

export default async function VerifyOtpPage() {
    const otpData = await getOtpData();
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner className="size-8" /></div>}>
            <VerifyOtp email={otpData!.email} status={otpData!.status} />
        </Suspense>
    );
}
