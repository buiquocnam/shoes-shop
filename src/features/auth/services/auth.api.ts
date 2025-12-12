import { apiClient } from "@/lib/api";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
} from "@/features/auth/schema";
import type {
  AuthResponse,
  VerifyEmailType,
  ChangePasswordType,
} from "@/features/auth/types";
import { useAuthStore, useCartStore } from "@/store";

export const authApi = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    return response.result;
  },
  register: async (
    data: Omit<RegisterFormData, "confirmPassword">
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.result;
  },
  sendResetPasswordEmail: async (
    data: ForgotPasswordFormData
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/auth/email/generate-otp?email=${data.email}`
    );
    return response.result;
  },
  verifyOTP: async (data: VerifyEmailType): Promise<boolean> => {
    const response = await apiClient.post<boolean>(
      `/auth/email/verify-account`,
      {
        email: data.email,
        otp: data.otp,
        status: data.status,
      }
    );
    return response.result;
  },
  changePassword: async (
    data: ChangePasswordType
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/auth/email/change-password`,
      {
        email: data.email,
        password: data.password,
        newPass: data.newPass,
        status: data.status,
      }
    );
    return response.result;
  },
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh");
    return response.result;
  },
  logout: async (): Promise<void> => {
    await Promise.all([
      useAuthStore.getState().logout(),
      useCartStore.getState().clearCart(),
    ]);
  },
};
