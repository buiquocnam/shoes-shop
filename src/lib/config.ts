/**
 * API Configuration
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const isDev = process.env.NODE_ENV === "development";

/**
 * Auth endpoints
 */
export const AUTH_REFRESH_ENDPOINT = "/auth/refresh";
