import { apiClient } from '@/lib/api';
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '@/features/auth/schema';
import type { AuthResponse, User } from '@/features/auth/types';
import { useAuthStore } from '@/store/useAuthStore';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

export async function login(credentials: LoginFormData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    AUTH_ENDPOINTS.LOGIN,
    {
      email: credentials.email,
      password: credentials.password,
    }
  );

  return response.result;
}


export async function register(data: RegisterFormData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    AUTH_ENDPOINTS.REGISTER,
    data
  );
  return response.result;
}

export async function forgotPassword(data: ForgotPasswordFormData): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    {
      email: data.email,
    }
  );
  return response.result;
}


export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    AUTH_ENDPOINTS.RESET_PASSWORD,
    {
      token,
      password: newPassword,
    }
  );
  return response.result;
}


export async function refreshToken(refreshToken: string): Promise<{ token: string }> {
  const response = await apiClient.post<{ token: string }>(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    {
      refreshToken,
    }
  );
  return response.result;
}


export async function logout(token: string): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}${AUTH_ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Logout is best-effort, don't throw error
    console.error('Logout error:', error);
  }
}


