import type { ApiResponse } from "@/types/api";
import { getHeaders } from "./api-headers";
import { ensureValidToken } from "./token";
import { API_BASE_URL, isDev, AUTH_REFRESH_ENDPOINT } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
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
  const isAuthRefreshEndpoint = endpoint.includes(AUTH_REFRESH_ENDPOINT);

  // Flow: Check token expired trước khi gọi API
  // 1. Nếu expired → refresh token
  // 2. Nếu refresh thành công → token đã được set trong store → gọi API
  // 3. Nếu refresh fail → throw error (sẽ redirect login ở component)
  if (!isAuthRefreshEndpoint) {
    await ensureValidToken();
  }

  const headers = getHeaders(endpoint, data);

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
    if (err instanceof Error && err.message.includes("Session expired")) {
      throw err;
    }

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

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "PUT", endpoint, data });
  },

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "PATCH", endpoint, data });
  },

  async delete<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>({ method: "DELETE", endpoint, data });
  },
};
