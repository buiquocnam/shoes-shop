"use client";

import { authApi } from "../services/auth.api";
import type { RegisterFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();

  return useMutation<
    AuthResponse,
    Error,
    Omit<RegisterFormData, "confirmPassword">
  >({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
      toast.success("Please check your email for verification");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
}
