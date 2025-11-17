"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/features/auth/services/auth.api";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormData } from "@/features/auth/schema";
import { cn } from "@/lib/utils";
import { setAuthCookies } from "@/lib/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(values);

      // Save to store
      setAuth(response.user, response.access_token, response.refresh_token);
      await setAuthCookies(response.access_token, response.refresh_token);

      // Redirect to callbackUrl if exists, otherwise redirect to home
      const callbackUrl = searchParams.get("callbackUrl");
      const redirectPath = callbackUrl && callbackUrl !== "/login"
        ? decodeURIComponent(callbackUrl)
        : "/";
      router.push(redirectPath);

    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
      >
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-gray-900 text-sm hover:underline"
        >
          Forget password
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full bg-[#1a365d] text-white hover:bg-[#1a365d]/90",
            "h-12 text-sm font-semibold uppercase rounded-lg",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? "Signing in..." : "LOG IN"}
        </Button>
      </form>
    </Form>
  );
};
