'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormData } from '@/features/auth/schema';
import { useChangePassword } from '@/features/auth/hooks';
import { Spinner } from '@/components/ui/spinner';

interface ChangePasswordFormProps {
    email: string;
    status: 'FORGET_PASS' | 'CHANGE_PASS';
}

export default function ChangePasswordForm({ email, status }: ChangePasswordFormProps) {
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
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <p className="text-4xl font-bold">
                    Change Password
                </p>
                <p className="text-gray-500 mt-2 text-center">
                    {status === 'FORGET_PASS'
                        ? 'Enter your new password to reset your account.'
                        : 'Enter your current password and new password.'}
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {status === 'CHANGE_PASS' && (
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="font-medium pb-2">
                                        Current Password
                                    </FieldLabel>
                                    <div className="relative flex w-full flex-1 items-stretch">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your current password"
                                            className="w-full h-12 focus:border-primary"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4"
                                            variant="ghost"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                        </Button>
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    )}

                    <Controller
                        control={form.control}
                        name="newPass"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-medium pb-2">
                                    New Password
                                </FieldLabel>
                                <div className="relative flex w-full flex-1 items-stretch">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        className="w-full h-12 focus:border-primary"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4"
                                        variant="ghost"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                    </Button>
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="confirmNewPass"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-medium pb-2">
                                    Confirm New Password
                                </FieldLabel>
                                <div className="relative flex w-full flex-1 items-stretch">
                                    <Input
                                        id="confirm-new-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your new password"
                                        className="w-full h-12 focus:border-primary"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4"
                                        variant="ghost"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                    </Button>
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full rounded-lg bg-primary h-12 px-6 font-bold hover:bg-primary/90 text-white"
                        disabled={isPending}
                    >
                        {isPending ? <Spinner className="size-6" /> : <span>Change Password</span>}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-base mt-8">
                Remember your password?{' '}
                <Link className="font-semibold text-primary hover:underline" href="/login">
                    Log In
                </Link>
            </p>
        </div>
    );
}
