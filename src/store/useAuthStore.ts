import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { getRoleFromToken } from "@/lib/jwt";
import { Role } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      return {
        user: null,
        accessToken: null,
        _hasHydrated: false,

        setAuth: (user, accessToken) => {
          set({ user, accessToken });
        },

        updateUser: (updatedUser) => {
          set({ user: updatedUser });
        },

        logout: () => {
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          set({ user: null, accessToken: null });
        },
      };
    },
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store:", error);
          }
        };
      },
    }
  )
);


