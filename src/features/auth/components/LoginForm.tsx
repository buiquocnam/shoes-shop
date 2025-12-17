"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks";
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/features/auth/schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormData) {
    login(values);
  }

  function handleGoogleLogin() {
    // Redirect directly to Google OAuth endpoint
    const OAUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
    window.location.href = `${OAUTH_URL}`;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-4xl">
          Welcome Back
        </p>
        <p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal">
          Log in to access your account and start shopping.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="you@example.com"
                    className="w-full h-12"
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
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center pb-2">
                    <FormLabel>Password</FormLabel>
                    <Link
                      className="text-primary text-sm font-medium leading-normal hover:underline"
                      href="/forget-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative w-full flex items-center">
                    <FormControl>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full h-12"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                      <Button
                        className="p-0 h-auto min-w-0"
                        variant="ghost"
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosedIcon className="size-5" /> : <EyeIcon className="size-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error.message}
            </div>
          )}

          <Button
            className="w-full rounded-lg bg-primary h-12 px-6 font-bold hover:bg-primary/90"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Signing in..." : "Log In"}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12"
        onClick={handleGoogleLogin}
        disabled={isPending}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-subtext-light dark:text-subtext-dark text-base mt-8">
        Don't have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
