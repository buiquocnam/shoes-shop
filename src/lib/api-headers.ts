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
    const { accessToken } = useAuthStore.getState();
    const isAuthRefreshEndpoint = endpoint.includes(AUTH_REFRESH_ENDPOINT);

    // Refresh endpoint: Backend tự đọc refresh token từ httpOnly cookie
    // Không cần gửi refresh token trong header
    if (isAuthRefreshEndpoint) {
      // Không set Authorization header, backend sẽ đọc từ cookie
    } else if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch {
    // Silent fail - không có token thì không set header
  }

  return headers;
}
