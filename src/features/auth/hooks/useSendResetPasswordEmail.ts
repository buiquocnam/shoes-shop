"use client";

import { authApi } from "../services/auth.api";
import type { ForgotPasswordFormData } from "../schema";
import { useRouter } from "next/navigation";
import { setOtpData } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSendResetPasswordEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => authApi.sendResetPasswordEmail(data),
    onSuccess: async (_, variables) => {
      await setOtpData(variables.email, "FORGET_PASS");
      toast.success("OTP sent to your email!");
      router.push("/verify-otp");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    },
  });
}
