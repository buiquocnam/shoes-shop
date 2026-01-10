"use client";

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
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
import { useTranslations } from 'next-intl';

export default function ForgetForm() {
    const t = useTranslations('Auth.forgotPassword');
    const tAuth = useTranslations('Auth.login');
    const tCommon = useTranslations('Common');
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
            toast.success(t('success') || 'OTP sent successfully');
            await setOtpData(data.email, 'FORGET_PASS');
            router.push('/verify-otp');
        } catch (error) {
            console.error('Error sending reset password email:', error);
            toast.error(error instanceof Error ? error.message : tCommon('error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSendResetPasswordEmail)}>
                <FieldGroup>
                    <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email">{tAuth('email')}</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder={tAuth('emailPlaceholder') || 'Enter email'}
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
                        {isLoading ? <Spinner className="size-6" /> : t('submit')}
                    </Button>

                    <FieldDescription className="text-center text-base">
                        {t('hasAccount') || 'Remember password?'} {' '}
                        <Link className="font-semibold text-primary hover:underline" href="/login">
                            {tAuth('submit')}
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}
