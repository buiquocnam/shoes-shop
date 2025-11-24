"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";

// Danh sách auth routes
const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/verify-otp"];

export function useAuthGuard(redirectTo?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!hasHydrated) {
      setShouldRender(false);
      return;
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // Nếu đang ở auth route và đã authenticated → redirect về home
    if (isAuthRoute && isAuthenticated) {
      router.replace("/");
      setShouldRender(false);
      return;
    }

    // Nếu đang ở protected route và chưa authenticated → redirect về login
    if (!isAuthRoute && !isAuthenticated) {
      // Chỉ redirect nếu chưa ở /login
      if (pathname !== "/login") {
        router.replace(
          `/login?redirect=${encodeURIComponent(redirectTo || pathname)}`
        );
      }
      setShouldRender(false);
      return;
    }

    // Cho phép render
    setShouldRender(true);
  }, [hasHydrated, isAuthenticated, router, pathname, redirectTo]);

  return { shouldRender, isAuthenticated, hasHydrated };
}
