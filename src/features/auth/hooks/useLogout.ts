"use client";

import { authApi } from "../services/auth.api";
import { useAuthStore, useCartStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { removeAccessTokenCookie } from "@/lib/middleware/cookies";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await Promise.all([logout(), clearCart()]);
      removeAccessTokenCookie();
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
