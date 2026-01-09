'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/services/auth.api';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { clearOtpData, setOtpData } from '@/lib/auth';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function VerifyOtp({ email, status }: { email: string, status: 'REGISTER' | 'FORGET_PASS' }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
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
            await authApi.sendResetPasswordEmail({ email: email });
            await setOtpData(email, status);
            toast.success('OTP đã được gửi lại đến email của bạn!');
            otpForm.reset();
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error(error instanceof Error ? error.message : 'Gửi lại OTP thất bại. Vui lòng thử lại.');
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
                toast.success('Xác thực OTP thành công!');
                router.push('/login');
            } else {
                toast.error('OTP không hợp lệ. Vui lòng thử lại.');
            }
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error instanceof Error ? error.message : 'Xác thực OTP thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    Xác thực email
                </h1>
                <p className="text-muted-foreground">
                    Nhập mã xác thực gồm 6 chữ số vừa được gửi đến email của bạn.
                </p>
            </div>

            <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)}>
                <FieldGroup>
                    <Controller
                        control={otpForm.control}
                        name="otp"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="otp">Mã xác thực</FieldLabel>
                                <div className="flex justify-center py-2">
                                    <InputOTP
                                        maxLength={6}
                                        id="otp"
                                        {...field}
                                    >
                                        <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <FieldDescription>
                                    Nhận mã? <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isResending || isLoading}
                                        className="text-primary hover:underline font-medium disabled:opacity-50"
                                    >
                                        {isResending ? 'Đang gửi...' : 'Gửi lại'}
                                    </button>
                                </FieldDescription>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 font-bold"
                        disabled={isLoading || isResending}
                    >
                        {isLoading ? <Spinner className="size-6" /> : "Xác thực OTP"}
                    </Button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại đăng nhập
                    </Link>
                </FieldGroup>
            </form>
        </div>
    );
}