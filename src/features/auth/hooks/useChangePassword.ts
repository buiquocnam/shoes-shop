"use client";

import { authApi } from "../services/auth.api";
import type { ChangePasswordType } from "../types";
import { useRouter } from "next/navigation";
import { clearOtpData } from "@/lib/auth";
import { useMutationWithToast } from "@/features/shared";

export function useChangePassword() {
  const router = useRouter();

  return useMutationWithToast<{ message: string }, ChangePasswordType>({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: async (_, variables) => {
      await clearOtpData();
      if (variables.status === "FORGET_PASS") {
        router.push("/login");
      } else {
        router.push("/profile");
      }
    },
    successMessage: "Password changed successfully!",
    errorMessage: (error) =>
      error.message || "Failed to change password. Please try again.",
  });
}

