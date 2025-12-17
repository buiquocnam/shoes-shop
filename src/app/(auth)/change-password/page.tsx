import type { Metadata } from 'next';
import { ChangePasswordForm } from '@/features/auth/components';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getOtpData } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Change Password - ShoeShop',
    description: 'Change your account password',
};

export default async function ChangePasswordPage() {
    const otpData = await getOtpData();

    // Redirect if no OTP data or not FORGET_PASS status
    if (!otpData || !otpData.email || otpData.status !== 'FORGET_PASS') {
        redirect('/forget-password');
    }

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner className="size-8" /></div>}>
            <ChangePasswordForm email={otpData.email} status={otpData.status} />
        </Suspense>
    );
}
