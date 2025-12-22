import { useAuthStore, useCartStore } from "@/store";
import { authApi } from "@/features/auth/services/auth.api";
import { isTokenExpired } from "./jwt";
import { isDev } from "./config";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token and update auth store
 */
export async function refreshAccessToken(): Promise<string> {
  const { setAuth, logout, refreshToken } = useAuthStore.getState();
  const { clearCart } = useCartStore.getState();

  // Kiểm tra có refresh token không
  if (!refreshToken) {
    if (isDev) {
      console.error("❌ No refresh token available");
    }
    logout();
    clearCart();
    throw new Error("Session expired. Please login again.");
  }

  try {
    const response = await authApi.refreshToken();
    const { user, access_token, refresh_token } = response;

    setAuth(user, access_token, refresh_token);

    if (isDev) {
      console.log("✅ Token refreshed and auth store updated");
    }

    return access_token;
  } catch (error) {
    if (isDev) {
      console.error("❌ Failed to refresh token:", error);
    }

    logout();
    clearCart();

    throw new Error("Session expired. Please login again.");
  }
}

/**
 * Check và refresh token nếu cần (với lock mechanism)
 * Flow:
 * 1. Nếu token expired → refresh token
 * 2. Nếu refresh thành công → token đã được set trong store
 * 3. Nếu refresh fail → throw error (sẽ redirect login ở component)
 */
export async function ensureValidToken(): Promise<void> {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) return;

  if (!isTokenExpired(accessToken)) return;

  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken()
    .then((token) => {
      isRefreshing = false;
      refreshPromise = null;
      return token;
    })
    .catch((error) => {
      isRefreshing = false;
      refreshPromise = null;
      throw error;
    });

  await refreshPromise;
}
