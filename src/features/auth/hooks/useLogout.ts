"use client";

import { authApi } from "../services/auth.api";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng xuất thất bại. Vui lòng thử lại.");
      router.push("/login");
    },
  });
}
