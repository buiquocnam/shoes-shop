import { useAuthStore, useCartStore } from "@/store";
import { authApi } from "@/features/auth/services/auth.api";
import { isTokenExpired } from "./jwt";
import { isDev } from "./config";

// Lock để tránh multiple refresh calls cùng lúc
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token and update auth store
 * @throws Error with message "Session expired. Please login again." if refresh fails
 */
export async function refreshAccessToken(): Promise<string> {
  const { setAuth, logout } = useAuthStore.getState();
  const { clearCart } = useCartStore.getState();

  try {
    // Backend tự đọc refresh token từ httpOnly cookie
    const response = await authApi.refreshToken();
    const { user, access_token } = response;

    // Chỉ lưu access token, refresh token nằm trong cookie
    setAuth(user, access_token);

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

  // Không có token → không cần refresh
  if (!accessToken) return;

  // Token còn hợp lệ → không cần refresh
  if (!isTokenExpired(accessToken)) return;

  // Token expired → refresh (refresh token nằm trong httpOnly cookie)
  // Backend sẽ tự đọc refresh token từ cookie khi gọi refresh endpoint
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
