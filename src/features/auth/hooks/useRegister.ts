"use client";

import { authApi } from "../services/auth.api";
import type { RegisterFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useMutationWithToast } from "@/features/shared";
import { setAccessTokenCookie } from "@/lib/middleware/cookies";

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutationWithToast<
    AuthResponse,
    Omit<RegisterFormData, "confirmPassword">
  >({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (response) => {
      // setAuth sẽ tự động set cookie
      setAuth(response.user, response.access_token, response.refresh_token);
      router.push("/");
    },
    successMessage: "Registration successful",
    errorMessage: (error) =>
      error.message || "Registration failed. Please try again.",
  });
}
