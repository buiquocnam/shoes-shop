"use client";

import { authApi } from "../services/auth.api";
import type { ChangePasswordType } from "../types";
import { useRouter } from "next/navigation";
import { clearOtpData } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useChangePassword() {
  const router = useRouter();

  return useMutation<{ message: string }, Error, ChangePasswordType>({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: async (_, variables) => {
      await clearOtpData();
      toast.success("Đổi mật khẩu thành công!");
      if (variables.status === "FORGET_PASS") {
        router.push("/login");
      } else {
        router.push("/profile");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    },
  });
}
