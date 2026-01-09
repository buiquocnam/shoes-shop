'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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

export default function RegisterForm() {
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
                    Tạo tài khoản
                </h1>
                <p className="text-muted-foreground">
                    Nhận quyền truy cập các ưu đãi độc quyền và thanh toán nhanh hơn.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Field data-invalid={!!form.formState.errors.name}>
                        <FieldLabel htmlFor="full-name">Họ và tên</FieldLabel>
                        <Input
                            id="full-name"
                            placeholder="Nhập họ và tên của bạn"
                            className="h-12"
                            {...form.register("name")}
                        />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>

                    <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel htmlFor="email">Địa chỉ email</FieldLabel>
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
                        <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Tạo mật khẩu"
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
                        <FieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</FieldLabel>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
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
                        {isPending ? <Spinner className="size-6" /> : "Tạo tài khoản"}
                    </Button>

                    <FieldDescription className="text-center text-base">
                        Đã có tài khoản?{' '}
                        <Link className="font-bold text-primary hover:underline" href="/login">
                            Đăng nhập
                        </Link>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}