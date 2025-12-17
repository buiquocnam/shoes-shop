import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/global";
import {
  setAccessTokenCookie,
  removeAccessTokenCookie,
} from "@/lib/middleware/cookies";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        // Sync cookie khi setAuth được gọi
        if (typeof window !== "undefined") {
          setAccessTokenCookie(accessToken);
        }
      },

      logout: () => {
        set({
          user: null,
          refreshToken: null,
          accessToken: null,
          isAuthenticated: false,
        });
        // Remove cookie khi logout
        if (typeof window !== "undefined") {
          removeAccessTokenCookie();
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store:", error);
          }

          // Sau khi rehydrate, sync cookie nếu có accessToken
          if (state && state.accessToken && typeof window !== "undefined") {
            setAccessTokenCookie(state.accessToken);
          }
        };
      },
    }
  )
);
