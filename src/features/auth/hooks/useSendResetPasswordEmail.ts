"use client";

import { authApi } from "../services/auth.api";
import type { ForgotPasswordFormData } from "../schema";
import { useRouter } from "next/navigation";
import { setOtpData } from "@/lib/auth";
import { useMutationWithToast } from "@/features/shared";

export function useSendResetPasswordEmail() {
  const router = useRouter();

  return useMutationWithToast<{ message: string }, ForgotPasswordFormData>({
    mutationFn: (data) => authApi.sendResetPasswordEmail(data),
    onSuccess: async (_, variables) => {
      await setOtpData(variables.email, "FORGET_PASS");
      router.push("/verify-otp");
    },
    successMessage: "OTP sent to your email!",
    errorMessage: (error) =>
      error.message || "Failed to send OTP. Please try again.",
  });
}
