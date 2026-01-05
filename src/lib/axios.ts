import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store";
import { API_BASE_URL, isDev } from "./config";
import type { ApiResponse } from "@/types/api";
import { ensureValidToken } from "./token";

/**
 * Axios instance với cấu hình base
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});



axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Check và refresh token trước khi gọi API (chỉ ở client-side)
      if (typeof window !== "undefined") {
        await ensureValidToken();
      }

      // Inject access token vào headers
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      if (isDev) {
        console.error("❌ Error in request interceptor:", error);
      }
      return Promise.reject(error);
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse | unknown>) => {
    const data = response.data as ApiResponse;
    
    // Nếu response có dạng ApiResponse, extract result
    if (data && typeof data === "object" && "result" in data) {
      response.data = data.result;
    }
    
    return response;
  },
  (error: AxiosError) => {
    if (isDev) {
      console.error("❌ API Error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    // Xử lý lỗi từ API
    if (error.response) {
      const responseData = error.response.data;

      // Nếu error response có dạng {code, result/message}
      if (responseData && typeof responseData === "object" && "code" in responseData) {
        const apiError = responseData as ApiResponse & { message?: string };
        error.message = apiError.message || error.message || "An error occurred";
        (error as any).code = apiError.code;
      }
    }

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
