"use client";

import { authApi } from "../services/auth.api";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserRoleFromToken } from "@/lib/middleware/auth";
import { Role } from "@/types/global";
import { toast } from "sonner";

export function useGoogleLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation<AuthResponse, Error, string>({
    mutationFn: (code) => authApi.loginWithGoogle(code),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
      const userRole = getUserRoleFromToken(response.access_token);

      if (userRole === Role.ADMIN) {
        router.replace("/admin");
        return;
      }
   
      requestAnimationFrame(() => {
        router.replace("/");
      });
      toast.success("Login with Google successful");
    },
    onError: (error) => {
      toast.error(error.message || "Google login failed. Please try again.");
    },
  });
}
