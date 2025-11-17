import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any | null;
  refreshToken: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: any, refreshToken: string, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, refreshToken, accessToken) => {
        set({ user, refreshToken, accessToken, isAuthenticated: true });
      },

      logout: () =>
        set({ user: null, refreshToken: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
