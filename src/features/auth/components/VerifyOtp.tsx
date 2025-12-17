'use client';

import { Form, FormControl, FormItem, FormField, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/services/auth.api';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearOtpData, setOtpData } from '@/lib/auth';

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function VerifyOtp({ email, status }: { email: string, status: 'REGISTER' | 'FORGET_PASS' }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false); // State riêng cho resend
    const router = useRouter();
    const otpForm = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const handleResendOTP = async () => {
        setIsResending(true);
        try {
            // Gửi lại OTP
            await authApi.sendResetPasswordEmail({ email: email });
            // Cập nhật lại cookie với thời gian mới
            await setOtpData(email, status);
            toast.success('OTP sent to your email!');
            // Reset form để user nhập lại
            otpForm.reset();
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    }

    const handleVerifyOTP = async (data: OTPFormData) => {
        setIsLoading(true);
        try {
            const response = await authApi.verifyOTP({
                email: email,
                otp: data.otp,
                status: status,
            });
            if (response) {
                await clearOtpData();
                toast.success('OTP verified successfully!');
                // Redirect based on status
                if (status === 'FORGET_PASS') {
                    // Save email to cookie for change password page
                    await setOtpData(email, status);
                    router.push('/change-password');
                } else {
                    router.push('/login');
                }
            } else {
                toast.error('Invalid OTP. Please try again.');
            }
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 mb-8">
                    <p className="text-4xl font-bold">
                        Verify your email
                    </p>
                    <p className="text-gray-500 mt-2 text-center">
                        Enter the code sent to your email address.
                    </p>
                </div>

                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="flex flex-col gap-6">
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                {...field}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} className='h-12 w-12' />
                                                    <InputOTPSlot index={1} className='h-12 w-12' />
                                                    <InputOTPSlot index={2} className='h-12 w-12' />
                                                    <InputOTPSlot index={3} className='h-12 w-12' />
                                                    <InputOTPSlot index={4} className='h-12 w-12' />
                                                    <InputOTPSlot index={5} className='h-12 w-12' />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-center' />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full rounded-lg bg-primary h-12 px-6 font-bold hover:bg-primary/90 text-white"
                            disabled={isLoading || isResending}
                        >
                            {isLoading ? <Spinner className="size-6" /> : <span>Verify OTP</span>}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-base mt-6">
                    Didn't receive the code?{' '}
                    <Button
                        onClick={handleResendOTP}
                        variant="link"
                        disabled={isResending || isLoading}
                        className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed "
                    >
                        {isResending ? 'Sending...' : 'Resend'}
                    </Button>
                </p>

                <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-center text-base mt-4 text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    )
}