'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel, FieldGroup, FieldDescription } from '@/components/ui/field';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema';
import { useRegister } from '@/features/auth/hooks';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { setOtpData } from '@/lib/auth';
import { useTranslations } from 'next-intl';

export default function RegisterForm() {
    const t = useTranslations('Auth.register');
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: register, isPending, error } = useRegister();
    const router = useRouter();
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    function onSubmit(values: RegisterFormData) {
        const { confirmPassword, ...registerData } = values;
        register(registerData as Omit<RegisterFormData, 'confirmPassword'>, {
            onSuccess: async () => {
                await setOtpData(registerData.email, 'REGISTER');
                router.push("/verify-otp");
            },
        });
    }

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

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Field data-invalid={!!form.formState.errors.name}>
                        <FieldLabel htmlFor="full-name">{t('name')}</FieldLabel>
                        <Input
                            id="full-name"
                            placeholder={t('namePlaceholder')}
                            className="h-12"
                            {...form.register("name")}
                        />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>

                    <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="h-12"
                            {...form.register("email")}
                        />
                        <FieldError errors={[form.formState.errors.email]} />
                    </Field>

                    <Field data-invalid={!!form.formState.errors.password}>
                        <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t('password')}
                                className="h-12 pr-12"
                                {...form.register("password")}
                            />
                            <Button
                                className="absolute right-0 top-0 h-12 w-12 p-0"
                                variant="ghost"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                            </Button>
                        </div>
                        <FieldError errors={[form.formState.errors.password]} />
                    </Field>

                    <Field data-invalid={!!form.formState.errors.confirmPassword}>
                        <FieldLabel htmlFor="confirm-password">{t('confirmPassword')}</FieldLabel>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder={t('confirmPassword')}
                            className="h-12"
                            {...form.register("confirmPassword")}
                        />
                        <FieldError errors={[form.formState.errors.confirmPassword]} />
                    </Field>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                            {error.message}
                        </div>
                    )}

                    <Button
                        className="w-full h-12 px-6 font-bold"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? <Spinner className="size-6" /> : t('submit')}
                    </Button>

                    <FieldDescription className="text-center text-base">
                        {t('hasAccount')}{' '}
                        <Link className="font-bold text-primary hover:underline" href="/login">
                            {t('login')}
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}
