import axiosInstance from "@/lib/axios";
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
  login: async (credentials: LoginFormData) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },
  register: async (
    data: Omit<RegisterFormData, "confirmPassword">
  ) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
  sendResetPasswordEmail: async (
    data: ForgotPasswordFormData
  ) => {
    const response = await axiosInstance.post<{ message: string }>(
      `/auth/email/generate-otp?email=${data.email}`
    );
    return response.data;
  },
  verifyOTP: async (data: VerifyEmailType) => {
    const response = await axiosInstance.post<boolean>(
      `/auth/email/verify-account`,
      {
        email: data.email,
        otp: data.otp,
        status: data.status,
      }
    );
    return response.data;
  },
  changePassword: async (
    data: ChangePasswordType
  ) => {
    const response = await axiosInstance.post<{ message: string }>(
      `/auth/email/change-password`,
      {
        email: data.email,
        password: data.password,
        newPass: data.newPass,
        status: data.status,
      }
    );
    return response.data;
  },
  refreshToken: async () => {
    const response = await axiosInstance.post<AuthResponse>("/auth/refresh");
    return response.data;
  },
  logout: async () => {
    await Promise.all([
      useAuthStore.getState().logout(),
      useCartStore.getState().clearCart(),
    ]);
  },

  loginWithGoogle: async (code: string) => {
    const formData = new FormData();
    formData.append("code", code);
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login/oauth2",
      formData
    );
    return response.data;
  },
};
