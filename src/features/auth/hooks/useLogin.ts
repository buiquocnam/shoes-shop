"use client";

import { authApi } from "../services/auth.api";
import type { LoginFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserRoleFromToken } from "@/lib/jwt";
import { Role } from "@/types/global";
import { toast } from "sonner";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      // Lưu cả access token và refresh token
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
      toast.success("Đăng nhập thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    },
  });
}
