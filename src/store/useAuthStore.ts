import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/global";
import { getRoleFromToken } from "@/lib/jwt";
import { Role } from "@/types/global";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

// Lưu set function để dùng trong onRehydrateStorage
let setHydrated: ((state: Partial<AuthState>) => void) | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Lưu set function để dùng trong onRehydrateStorage
      setHydrated = set;

      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        _hasHydrated: false,

        setAuth: (user, accessToken, refreshToken) => {
          set({ user, accessToken, refreshToken });
        },

        updateUser: (updatedUser) => {
          set({ user: updatedUser });
        },

        logout: () => {
          set({ user: null, accessToken: null, refreshToken: null });
        },
      };
    },
    {
      name: "auth-storage",

      // Chỉ persist dữ liệu cần thiết (không persist _hasHydrated)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),

      // Đánh dấu hydrate hoàn tất
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store:", error);
          }
          // Set _hasHydrated = true sau khi rehydrate xong
          // Sử dụng set function từ closure
          if (setHydrated) {
            setHydrated({ _hasHydrated: true });
          }
        };
      },
    }
  )
);


export function useIsAuthenticated() {
  return useAuthStore((state) => Boolean(state.accessToken));
}


export function useIsAdmin() {
  return useAuthStore((state) => {
    if (!state.accessToken) return false;
    const role = getRoleFromToken(state.accessToken);
    return role === Role.ADMIN;
  });
}
