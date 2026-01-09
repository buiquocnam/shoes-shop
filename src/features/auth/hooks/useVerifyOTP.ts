"use client";

import { authApi } from "../services/auth.api";
import type { VerifyEmailType } from "../types";
import { useRouter } from "next/navigation";
import { clearOtpData } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useVerifyOTP() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailType) => authApi.verifyOTP(data),
    onSuccess: async (response) => {
      if (response) {
        await clearOtpData();
        toast.success("OTP verified successfully!");
        router.push("/login");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify OTP. Please try again.");
    },
  });
}
