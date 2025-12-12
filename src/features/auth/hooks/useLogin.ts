"use client";

import { authApi } from "../services/auth.api";
import type { LoginFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutationWithToast } from "@/features/shared";
import { setAccessTokenCookie } from "@/lib/middleware/cookies";
import { getUserRoleFromToken } from "@/lib/middleware/auth";
import { Role } from "@/types/global";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutationWithToast<AuthResponse, LoginFormData>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      setAccessTokenCookie(response.access_token);
      const userRole = getUserRoleFromToken(response.access_token);

      // Nếu là ADMIN, redirect đến /admin và return ngay
      if (userRole === Role.ADMIN) {
        router.replace("/admin");
        return;
      }

      // Nếu không phải ADMIN, redirect theo redirect param hoặc về trang chủ
      const redirect = searchParams.get("redirect");
      const redirectPath = redirect ? decodeURIComponent(redirect) : "/";

      requestAnimationFrame(() => {
        router.replace(redirectPath);
      });
    },
    successMessage: "Login successful",
    errorMessage: (error) => error.message || "Login failed. Please try again.",
  });
}
