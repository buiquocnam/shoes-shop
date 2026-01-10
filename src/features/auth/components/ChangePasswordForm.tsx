'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, Link } from '@/i18n/routing';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormData } from '@/features/auth/schema';
import { useChangePassword } from '@/features/auth/hooks';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from 'next-intl';

interface ChangePasswordFormProps {
    email: string;
    status: 'FORGET_PASS' | 'CHANGE_PASS';
}

export default function ChangePasswordForm({ email, status }: ChangePasswordFormProps) {
    const t = useTranslations('Auth.changePassword');
    const tAuth = useTranslations('Auth.login');
    const tCommon = useTranslations('Common');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutate: changePassword, isPending } = useChangePassword();

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: '',
            newPass: '',
            confirmNewPass: '',
        },
    });

    function onSubmit(values: ChangePasswordFormData) {
        const { confirmNewPass, ...changePasswordData } = values;
        changePassword({
            email,
            password: status === 'FORGET_PASS' ? '' : changePasswordData.password || '',
            newPass: changePasswordData.newPass,
            status,
        });
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground">
                    {status === 'FORGET_PASS'
                        ? t('descriptionForget')
                        : t('descriptionChange')}
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    {status === 'CHANGE_PASS' && (
                        <Field data-invalid={!!form.formState.errors.password}>
                            <FieldLabel htmlFor="password">{t('currentPassword')}</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('currentPasswordPlaceholder')}
                                    className="h-12 pr-12"
                                    {...form.register("password")}
                                />
                                <Button
                                    type="button"
                                    className="absolute right-0 top-0 h-12 w-12 p-0"
                                    variant="ghost"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                </Button>
                            </div>
                            <FieldError errors={[form.formState.errors.password]} />
                        </Field>
                    )}

                    <Field data-invalid={!!form.formState.errors.newPass}>
                        <FieldLabel htmlFor="new-password">{t('newPassword')}</FieldLabel>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder={t('newPasswordPlaceholder')}
                                className="h-12 pr-12"
                                {...form.register("newPass")}
                            />
                            <Button
                                type="button"
                                className="absolute right-0 top-0 h-12 w-12 p-0"
                                variant="ghost"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                            </Button>
                        </div>
                        <FieldError errors={[form.formState.errors.newPass]} />
                    </Field>

                    <Field data-invalid={!!form.formState.errors.confirmNewPass}>
                        <FieldLabel htmlFor="confirm-new-password">{t('confirmNewPassword')}</FieldLabel>
                        <div className="relative">
                            <Input
                                id="confirm-new-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t('confirmNewPasswordPlaceholder')}
                                className="h-12 pr-12"
                                {...form.register("confirmNewPass")}
                            />
                            <Button
                                type="button"
                                className="absolute right-0 top-0 h-12 w-12 p-0"
                                variant="ghost"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                            </Button>
                        </div>
                        <FieldError errors={[form.formState.errors.confirmNewPass]} />
                    </Field>

                    <Button
                        type="submit"
                        className="w-full h-12 font-bold"
                        disabled={isPending}
                    >
                        {isPending ? <Spinner className="size-6" /> : t('submit')}
                    </Button>

                    <FieldDescription className="text-center text-base">
                        {tAuth('noAccount')} {' '}
                        <Link className="font-semibold text-primary hover:underline" href="/register">
                            {tAuth('register')}
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}
