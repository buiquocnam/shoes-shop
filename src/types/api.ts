// API-related types

export interface ApiResponse<T> {
  code: number;
  result: T;
}

export interface ApiError {
  code?: number;
  message?: string;
 
}



export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

