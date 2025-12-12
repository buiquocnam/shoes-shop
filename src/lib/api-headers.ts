import { isTokenExpired } from "./jwt";
import { useAuthStore, useCartStore } from "@/store";
import { authApi } from "@/features/auth/services/auth.api";
import {
  removeAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/middleware/cookies";

const isDev = process.env.NODE_ENV === "development";

async function refreshAccessToken(): Promise<string> {
  const { setAuth, logout } = useAuthStore.getState();
  const { clearCart } = useCartStore.getState();

  try {
    const response = await authApi.refreshToken();
    const { user, access_token, refresh_token } = response;

    // setAuth sẽ tự động set cookie
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
    removeAccessTokenCookie();

    throw new Error("Session expired. Please login again.");
  }
}

/**
 * Tạo headers cho API request, tự động refresh token nếu expired
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
      // Các endpoint khác → dùng access token
      headers.set("Authorization", `Bearer ${accessToken}`);

      if (isTokenExpired(accessToken)) {
        if (isDev) {
          console.warn("⚠️ Token expired, refreshing...");
        }

        try {
          const newAccessToken = await refreshAccessToken();
          headers.set("Authorization", `Bearer ${newAccessToken}`);
        } catch (error) {
          // Refresh thất bại → đã logout trong refreshAccessToken
          // Throw error để request fail, client-side sẽ handle redirect
          throw error;
        }
      }
    }
  } catch (error) {
    // Nếu error là từ refresh token thất bại → throw lại để request fail
    if (error instanceof Error && error.message.includes("Session expired")) {
      throw error;
    }

    if (isDev) {
      console.warn("⚠️ Failed to get access token:", error);
    }
  }

  return headers;
}
