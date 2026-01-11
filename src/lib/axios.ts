import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store";
import type { ApiResponse } from "@/types/api";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject access token vào headers
    const { accessToken } = useAuthStore.getState();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    
    if (data && typeof data === "object" && "result" in data) {
      response.data = data.result;
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Xử lý lỗi từ API
    if (error.response) {
      const responseData = error.response.data;

      if (responseData && typeof responseData === "object" && "code" in responseData) {
        const apiError = responseData as ApiResponse & { message?: string };
        error.message = apiError.message || error.message || "An error occurred";
        (error as any).code = apiError.code;
      }
    }

    // Xử lý lỗi 401 (Unauthorized)
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
             originalRequest.headers.Authorization = 'Bearer ' + token;
          }
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dynamic import to avoid circular dependency
        const { authApi } = await import('@/features/auth/services/auth.api');
        const response = await authApi.refreshToken();
        
        const { access_token, user } = response;
        useAuthStore.getState().setAuth(user, access_token);
        
         // Update cookies
        document.cookie = `access_token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        processQueue(null, access_token);
        
        if (originalRequest.headers) {
           originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = "/vi/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
