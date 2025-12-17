import { isTokenExpired } from "./jwt";
import { useAuthStore, useCartStore } from "@/store";
import { authApi } from "@/features/auth/services/auth.api";
import {
  removeAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/middleware/cookies";

const isDev = process.env.NODE_ENV === "development";

/**
 * Refresh access token and update auth store
 * @throws Error with message "Session expired. Please login again." if refresh fails
 */
export async function refreshAccessToken(): Promise<string> {
  const { setAuth, logout } = useAuthStore.getState();
  const { clearCart } = useCartStore.getState();

  try {
    const response = await authApi.refreshToken();
    const { user, access_token, refresh_token } = response;

    // setAuth sẽ tự động set cookie
    setAuth(user, access_token, refresh_token);

    // Ensure cookie is set immediately (especially important for middleware)
    if (typeof window !== "undefined") {
      setAccessTokenCookie(access_token);
      if (isDev) {
        console.log("✅ Token refreshed and auth store updated, cookie synced");
      }
    } else if (isDev) {
      console.log("✅ Token refreshed and auth store updated (server-side)");
    }

    return access_token;
  } catch (error) {
    if (isDev) {
      console.error("❌ Failed to refresh token:", error);
    }

    logout();
    clearCart();
    removeAccessTokenCookie();

    // Redirect to login only on client-side when refresh fails
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // Only redirect if not already on login page
      if (!currentPath.startsWith("/login")) {
        const redirectPath = `/login?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectPath;
      }
    }

    throw new Error("Session expired. Please login again.");
  }
}

/**
 * Tạo headers cho API request
 * Note: Token refresh is handled in api.ts when receiving 401 response
 */
export async function getHeaders(
  endpoint: string,
  body?: unknown
): Promise<HeadersInit> {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (!(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const { accessToken, refreshToken } = useAuthStore.getState();
    const isAuthRefreshEndpoint = endpoint.includes("/auth/refresh");

    // Nếu là endpoint refresh → dùng refresh token trong header
    if (isAuthRefreshEndpoint && refreshToken) {
      headers.set("Authorization", `Bearer ${refreshToken}`);
      if (isDev) {
        console.log("🔄 Calling /auth/refresh with refresh_token in header");
      }
    } else if (accessToken) {
      // Các endpoint khác → dùng access token hiện có
      // Không refresh ở đây, để api.ts xử lý khi nhận 401
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch (error) {
    if (isDev) {
      console.warn("⚠️ Failed to get access token:", error);
    }
  }

  return headers;
}
