"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "@/store/useAuthStore";

export function useRefreshToken() {
  const { refreshToken: storedRefreshToken, setAuth, user } = useAuthStore();

  return useMutation<{ token: string }, Error, void>({
    mutationFn: async () => {
      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }
      return authApi.refreshToken(storedRefreshToken);
    },
    onSuccess: (response) => {
      // Update access token trong store
      // Giữ nguyên user và refresh token
      if (user && storedRefreshToken) {
        setAuth(user, response.token, storedRefreshToken);
      }
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error);
      // Có thể logout user nếu refresh token invalid
    },
  });
}

