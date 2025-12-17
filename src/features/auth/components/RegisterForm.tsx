'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema';
import { useRegister } from '@/features/auth/hooks';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
                // Save email to cookie before redirecting
                await setOtpData(registerData.email, 'REGISTER');
                router.push("/verify-otp");
            },
        });
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <p className="text-3xl sm:text-4xl">
                    Create an Account
                </p>
                <p className="font-normal leading-normal mt-2">
                    Get access to exclusive offers and faster checkout.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col">
                                    <label className="font-medium pb-2">
                                        Full Name
                                    </label>
                                    <FormControl>
                                        <Input
                                            id="full-name"
                                            placeholder="Enter your full name"
                                            className="w-full h-12 focus:border-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col">
                                    <label className="font-medium pb-2">
                                        Email Address
                                    </label>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="text"
                                            placeholder="Enter your email"
                                            className="w-full h-12 focus:border-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col">
                                    <label className="font-medium pb-2">
                                        Password
                                    </label>
                                    <div className="relative flex w-full flex-1 items-stretch">
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                className="w-full h-12 focus:border-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4 "
                                            variant="ghost"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                        </Button>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col">
                                    <label className="font-medium pb-2">
                                        Confirm Password
                                    </label>
                                    <FormControl>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="Confirm your password"
                                            className="w-full h-12 focus:border-primary"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
                            {error.message}
                        </div>
                    )}

                    <Button
                        className="w-full rounded-lg bg-primary h-12 px-6 font-bold hover:bg-primary/90"
                        disabled={isPending}
                    >
                        {isPending ? <Spinner className="size-6" /> : <span className="text-white">Create Account</span>}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-base font-normal text-subtle-light dark:text-subtle-dark">
                Already have an account?{' '}
                <Link className="font-bold text-primary hover:underline" href="/login">
                    Log In
                </Link>
            </p>
        </div>
    );
}