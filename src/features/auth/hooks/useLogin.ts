"use client";

import { authApi } from "../services/auth.api";
import type { LoginFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { setAccessTokenCookie } from "@/lib/middleware/cookies";
import { getUserRoleFromToken } from "@/lib/middleware/auth";
import { Role } from "@/types/global";
import { toast } from "sonner";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      const userRole = getUserRoleFromToken(response.access_token);

      if (userRole === Role.ADMIN) {
        router.replace("/admin");
        return;
      }

      const redirect = searchParams.get("redirect");
      const redirectPath = redirect ? decodeURIComponent(redirect) : "/";

      requestAnimationFrame(() => {
        router.replace(redirectPath);
      });
      toast.success("Login successful");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
}
