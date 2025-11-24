"use client";

import { authApi } from "../services/auth.api";
import type { LoginFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutationWithToast } from "@/features/shared";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutationWithToast<AuthResponse, LoginFormData>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      const redirect = searchParams.get("redirect");
      router.push(decodeURIComponent(redirect || "/"));
    },
    successMessage: "Login successful",
    errorMessage: (error) => error.message || "Login failed. Please try again.",
  });
}
