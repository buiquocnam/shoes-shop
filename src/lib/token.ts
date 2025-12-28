import axios from "axios";
import { useAuthStore, useCartStore } from "@/store";
import { API_BASE_URL, isDev } from "./config";
import { isTokenExpired } from "./jwt";
import type { AuthResponse } from "@/features/auth/types";
import type { ApiResponse } from "@/types/api";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Axios instance riêng để gọi refresh endpoint (không đi qua interceptor)
 */
const refreshAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

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
    // Gọi refresh endpoint với refresh token trong header
    const response = await refreshAxiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // Extract result từ ApiResponse (vì không đi qua interceptor)
    const data = response.data
    const authResponse: AuthResponse = data.result;

    const { user, access_token, refresh_token } = authResponse;

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
