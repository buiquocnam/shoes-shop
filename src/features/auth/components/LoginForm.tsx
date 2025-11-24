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
          >
            {isPending ? "Signing in..." : "Log In"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-subtext-light dark:text-subtext-dark text-base mt-8">
        Don't have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
