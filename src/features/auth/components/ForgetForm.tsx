"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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
            toast.success('OTP sent to your email!');
            await setOtpData(data.email, 'FORGET_PASS');
            router.push('/verify-otp');
        } catch (error) {
            console.error('Error sending reset password email:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <p className="text-4xl font-bold">
                    Reset your password
                </p>
                <p className="text-gray-500 mt-2 text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendResetPasswordEmail)} className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your email"
                                        className="w-full h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full rounded-lg bg-primary h-12 px-6 font-bold hover:bg-primary/90 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner className="size-6" /> : <span>Send Reset Link</span>}
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