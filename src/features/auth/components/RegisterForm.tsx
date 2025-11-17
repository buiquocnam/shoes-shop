'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema';
import { register } from '@/features/auth/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);


    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
        },
    });

    async function onSubmit(values: RegisterFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await register(values);
            setAuth(response.user, response.access_token, response.refresh_token);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Register failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-[350px] mx-auto"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Name"
                                    className="bg-white border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Email"
                                    className="bg-white border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Phone</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Phone"
                                    className="bg-white border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Address"
                                    className="bg-white border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="bg-white border-gray-300 focus:border-[#1a365d] focus:ring-[#1a365d] pr-10"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {error && (
                    <div className="text-red-600 text-sm text-center py-2">{error}</div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full bg-[#1a365d] text-white hover:bg-[#1a365d]/90",
                        "h-12 text-sm font-semibold uppercase rounded-lg",
                        isLoading && "opacity-60 cursor-not-allowed"
                    )}
                >
                    {isLoading ? "Registering..." : "Register"}
                </Button>
            </form>
        </Form>
    );
}