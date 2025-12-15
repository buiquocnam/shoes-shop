"use client";

import { authApi } from "../services/auth.api";
import type { RegisterFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useRouter } from "next/navigation";
import { useMutationWithToast } from "@/features/shared";

export function useRegister() {
  const router = useRouter();

  return useMutationWithToast<
    AuthResponse,
    Omit<RegisterFormData, "confirmPassword">
  >({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
    },
    successMessage: "Please check your email for verification",
    errorMessage: (error) =>
      error.message || "Registration failed. Please try again.",
  });
}
