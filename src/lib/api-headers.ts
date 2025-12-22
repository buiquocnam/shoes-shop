import { useAuthStore } from "@/store";
import { AUTH_REFRESH_ENDPOINT } from "./config";

/**
 * Tạo headers cho API request
 * Chỉ set header token - không xử lý logic refresh
 */
export function getHeaders(endpoint: string, body?: unknown): HeadersInit {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (!(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const { accessToken, refreshToken } = useAuthStore.getState();
    const isAuthRefreshEndpoint = endpoint.includes(AUTH_REFRESH_ENDPOINT);

    // Refresh endpoint: Thêm refresh token vào header
    if (isAuthRefreshEndpoint) {
      if (refreshToken) {
        headers.set("Authorization", `Bearer ${refreshToken}`);
      }
    } else if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch {
    // Silent fail - không có token thì không set header
  }

  return headers;
}
