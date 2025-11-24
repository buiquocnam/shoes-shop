import type { User } from "@/types/global";

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse extends RefreshTokenResponse {
  user: User;
}

export interface VerifyEmailType {
  email: string;
  otp: string;
  status: "REGISTER" | "FORGET_PASS";
}

export interface ChangePasswordType {
  email: string;
  password: string;
  newPass: string;
  status: "CHANGE_PASS" | "FORGET_PASS";
}
