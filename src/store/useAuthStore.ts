import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/global";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      logout: () =>
        set({
          user: null,
          refreshToken: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store:", error);
          }
          // Luôn set hasHydrated = true sau khi rehydrate (thành công hoặc thất bại)
          if (state) {
            state.setHasHydrated(true);
          } else {
            // Nếu state là undefined, tạo state mới và set hasHydrated
            useAuthStore.getState().setHasHydrated(true);
          }
        };
      },
    }
  )
);
