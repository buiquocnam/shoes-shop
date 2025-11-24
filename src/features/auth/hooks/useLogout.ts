"use client";

import { authApi } from "../services/auth.api";
import { useAuthStore, useCartStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMutationWithToast } from "@/features/shared";

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutationWithToast<void, void>({
    mutationFn: async () => {
      await Promise.all([logout(), clearCart()]);
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      router.push("/login");
    },
    successMessage: "Logged out successfully",
    errorMessage: (error) =>
      error.message || "Failed to logout. Please try again.",
  });
}
