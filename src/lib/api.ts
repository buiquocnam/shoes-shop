import type { ApiResponse } from '@/types/api';
import { getAccessToken } from './token';
import { isTokenExpired } from './jwt';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';



// 🧩 Lấy header có token, xử lý FormData tự động
async function getHeaders(body?: unknown): Promise<HeadersInit> {
  const headers: HeadersInit = { Accept: 'application/json' };

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const accessToken = await getAccessToken();
    if (accessToken && !isTokenExpired(accessToken)) {
      console.log("accessToken", accessToken);
      console.log("headers", headers);
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.warn('⚠️ Failed to get access token:', error);
  }

  return headers;
}

// 🚀 API client chính
export const apiClient = {
  // GET
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("url", url);
    try {
      const res = await fetch(url, { headers: await getHeaders() });

      if (!res.ok) {
        let message = `API request failed (${res.status})`;
        try {
          const errorData = await res.json();
          console.error('❌ API Error JSON:', errorData);
          message = errorData?.message || errorData?.error || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      return (await res.json()) as ApiResponse<T>;
    } catch (err) {
      throw new Error((err as Error).message || 'Network error');
    }
  },

  // POST
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: await getHeaders(data),
        body,
      });
      if (!res.ok) {
        let message = `API request failed (${res.status})`;
        try {
          const errorData = await res.json();
          console.error('❌ API Error JSON:', errorData);
          message = errorData?.message || errorData?.error || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      return (await res.json()) as ApiResponse<T>;
    } catch (err) {
      throw new Error((err as Error).message || 'Network error');
    }
  },

  // PUT
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: await getHeaders(data),
        body,
      });

      if (!res.ok) {
        let message = `API request failed (${res.status})`;
        try {
          const errorData = await res.json();
          console.error('❌ API Error JSON:', errorData);
          message = errorData?.message || errorData?.error || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      return (await res.json()) as ApiResponse<T>;
    } catch (err) {
      throw new Error((err as Error).message || 'Network error');
    }
  },

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: await getHeaders(data),
        body,
      });
      if (!res.ok) {
        let message = `API request failed (${res.status})`;
        try {
          const errorData = await res.json();
          console.error('❌ API Error JSON:', errorData);
          message = errorData?.message || errorData?.error || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      return (await res.json()) as ApiResponse<T>;
    } catch (err) {
      throw new Error((err as Error).message || 'Network error');
    }
  },

  // DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!res.ok) {
        let message = `API request failed (${res.status})`;
        try {
          const errorData = await res.json();
          console.error('❌ API Error JSON:', errorData);
          message = errorData?.message || errorData?.error || message;
        } catch {
          message = res.statusText || message;
        }
        throw new Error(message);
      }

      return (await res.json()) as ApiResponse<T>;
    } catch (err) {
      throw new Error((err as Error).message || 'Network error');
    }
  },
};
