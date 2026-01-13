"use client";

import { authApi } from "../services/auth.api";
import type { AuthResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserRoleFromToken } from "@/lib/jwt";
import { Role } from "@/types";
import { toast } from "sonner";

export function useGoogleLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => authApi.loginWithGoogle(code),
    onSuccess: (response) => {
      // Lưu cả access token và refresh token
      setAuth(response.user, response.access_token);
      const userRole = getUserRoleFromToken(response.access_token);

      if (userRole === "ADMIN") {
        router.replace("/admin");
        return;
      }

      requestAnimationFrame(() => {
        router.replace("/");
      });
      toast.success("Đăng nhập với Google thành công");
    },
    onError: (error) => {
      toast.error(
        error.message || "Đăng nhập Google thất bại. Vui lòng thử lại."
      );
    },
  });
}
