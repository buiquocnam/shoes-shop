import type { ApiResponse } from "@/types/api";
import { isTokenExpired } from "./jwt";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessToken } from "@/features/auth/utils/refreshToken";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const isDev = process.env.NODE_ENV === "development";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
}

async function getHeaders(
  endpoint: string,
  body?: unknown
): Promise<HeadersInit> {
  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (!(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const { accessToken } = useAuthStore.getState();
    const isAuthRefreshEndpoint = endpoint.includes("/auth/refresh");

    if (accessToken) {
      // Luôn gửi access token trong header (dù expired hay không)
      headers.set("Authorization", `Bearer ${accessToken}`);

      // Nếu token expired và KHÔNG phải endpoint refresh → tự động refresh token
      if (isTokenExpired(accessToken) && !isAuthRefreshEndpoint) {
        if (isDev) {
          console.warn("⚠️ Token expired, refreshing...");
        }

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          headers.set("Authorization", `Bearer ${newAccessToken}`);
        }
      }

      // Nếu là endpoint refresh → gửi expired token (backend đọc refresh token từ cookie/header)
      if (isAuthRefreshEndpoint && isTokenExpired(accessToken) && isDev) {
        console.log(
          "🔄 Calling /auth/refresh with expired access_token in header"
        );
      }
    }
  } catch (error) {
    if (isDev) {
      console.warn("⚠️ Failed to get access token:", error);
    }
  }

  return headers;
}

function prepareBody(data?: unknown) {
  if (!data) return undefined;
  return data instanceof FormData ? data : JSON.stringify(data);
}

async function handleErrorResponse(res: Response): Promise<never> {
  let message = `API request failed (${res.status})`;

  try {
    const errorData = await res.json();
    if (isDev) {
      console.error("❌ API Error:", errorData);
    }
    message = errorData?.message || errorData?.error || message;
  } catch {
    message = res.statusText || message;
  }

  throw new Error(message);
}

async function request<T>({
  method,
  endpoint,
  data,
}: RequestOptions): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const body = prepareBody(data);

  // ✅ Truyền endpoint vào getHeaders, nó sẽ tự check
  const headers = await getHeaders(endpoint, data);

  if (isDev) {
    console.log(
      `[${method}] ${url}`,
      data ? { body: data instanceof FormData ? "[FormData]" : data } : ""
    );
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      ...(body && { body }),
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    return (await res.json()) as ApiResponse<T>;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Network error";
    throw new Error(errorMessage);
  }
}

// 🚀 API client chính
export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>({ method: "GET", endpoint });
  },

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "POST", endpoint, data });
  },

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "PUT", endpoint, data });
  },

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "PATCH", endpoint, data });
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>({ method: "DELETE", endpoint });
  },
};
