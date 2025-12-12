import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "../services/auth.api";

const isDev = process.env.NODE_ENV === "development";

/**
 * Refresh access token và tự động cập nhật auth store
 * Sử dụng authApi.refreshToken() có sẵn
 * @returns access_token mới hoặc null nếu thất bại
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    // Dùng authApi.refreshToken() có sẵn, backend tự đọc refresh token từ cookie/header
    const response = await authApi.refreshToken();

    if (!response?.access_token) {
      throw new Error("Access token not found in response");
    }

    // Cập nhật auth store với dữ liệu mới
    const { setAuth } = useAuthStore.getState();
    const { user, access_token, refresh_token } = response;

    if (user) {
      setAuth(user, access_token, refresh_token);

      if (isDev) {
        console.log("✅ Token refreshed and auth store updated");
      }
    }

    return access_token;
  } catch (error) {
    if (isDev) {
      console.error("❌ Failed to refresh token:", error);
    }
    return null;
  }
}
