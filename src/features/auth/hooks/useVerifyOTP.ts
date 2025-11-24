"use client";

import { authApi } from "../services/auth.api";
import type { VerifyEmailType } from "../types";
import { useRouter } from "next/navigation";
import { clearOtpData } from "@/lib/auth";
import { useMutationWithToast } from "@/features/shared";
import { toast } from "sonner";

export function useVerifyOTP() {
  const router = useRouter();

  return useMutationWithToast<boolean, VerifyEmailType>({
    mutationFn: (data) => authApi.verifyOTP(data),
    onSuccess: async (response) => {
      if (response) {
        await clearOtpData();
        router.push("/login");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    },
    successMessage: (response) =>
      response ? "OTP verified successfully!" : "",
    errorMessage: (error) =>
      error.message || "Failed to verify OTP. Please try again.",
  });
}
