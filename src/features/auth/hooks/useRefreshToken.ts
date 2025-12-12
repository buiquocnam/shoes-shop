"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthResponse } from "../types";

export function useRefreshToken() {
  const { user, setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, void>({
    mutationFn: async () => {
      // Backend tự đọc refresh token từ cookie/header
      return authApi.refreshToken();
    },
    onSuccess: (response) => {
      // Cập nhật store với access_token và refresh_token mới từ response
      // setAuth sẽ tự động set cookie
      if (user) {
        setAuth(user, response.access_token, response.refresh_token);
      }
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error);
      // Có thể logout user nếu refresh token invalid
    },
  });
}
