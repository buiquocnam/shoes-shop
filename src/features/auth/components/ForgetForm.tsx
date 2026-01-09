"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { authApi } from '@/features/auth/services/auth.api';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schema';
import { setOtpData } from '@/lib/auth';

export default function ForgetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const handleSendResetPasswordEmail = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authApi.sendResetPasswordEmail(data);
            toast.success('OTP đã được gửi đến email của bạn!');
            await setOtpData(data.email, 'FORGET_PASS');
            router.push('/verify-otp');
        } catch (error) {
            console.error('Error sending reset password email:', error);
            toast.error(error instanceof Error ? error.message : 'Gửi OTP thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    Đặt lại mật khẩu
                </h1>
                <p className="text-muted-foreground">
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSendResetPasswordEmail)}>
                <FieldGroup>
                    <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email">Địa chỉ email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="h-12"
                            {...form.register("email")}
                        />
                        <FieldError errors={[form.formState.errors.email]} />
                    </Field>

                    <Button
                        type="submit"
                        className="w-full h-12 font-bold"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner className="size-6" /> : "Gửi mã xác thực"}
                    </Button>

                    <FieldDescription className="text-center text-base">
                        Nhớ mật khẩu của bạn?{' '}
                        <Link className="font-semibold text-primary hover:underline" href="/login">
                            Đăng nhập
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}