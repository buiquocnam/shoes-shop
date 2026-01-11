"use client";

import { authApi } from "../services/auth.api";
import type { LoginFormData } from "../schema";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserRoleFromToken } from "@/lib/jwt";
import { toast } from "sonner";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: ({email, password}: LoginFormData) => authApi.login({email, password}),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token);
      
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      const userRole = getUserRoleFromToken(response.access_token);

      if (userRole === "ADMIN") {
        router.replace("/admin/dashboard");
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
