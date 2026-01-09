"use client";

import { authApi } from "../services/auth.api";
import type { RegisterFormData } from "../schema";
import type { AuthResponse } from "../types";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Omit<RegisterFormData, 'confirmPassword'>) => authApi.register(data),
    onSuccess: () => {
      toast.success("Vui lòng kiểm tra email để xác thực");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    },
  });
}
