"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { isTokenExpired, getRoleFromToken, decodeToken } from "@/lib/jwt";
import { Role } from "@/types/global";
import { isDev } from "@/lib/config";

export function useTokenRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/login");
  const isUnauthorizedPage = pathname === "/unauthorized";

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window === "undefined") return;
    console.log("🔍 hasHydrated:", hasHydrated);
    // Đợi store rehydrate xong
    if (!hasHydrated) {
      if (isDev) {
        console.log("🔍 [Token Check] Waiting for hydration...");
      }
      return;
    }

    // Debug: Log token status
    if (isDev) {
      const decoded = accessToken ? decodeToken(accessToken) : null;
      console.log("🔍 Token check:", {
        hasToken: !!accessToken,
        canDecode: !!decoded,
        pathname,
        isAdminRoute,
        isLoginPage,
      });
    }

    // Nếu đang ở login page và có token -> redirect về trang đích
    if (isLoginPage && accessToken) {
      const redirect = searchParams.get("redirect");
      const redirectPath = redirect ? decodeURIComponent(redirect) : "/";

      // Check role nếu redirect đến admin route
      if (redirectPath.startsWith("/admin")) {
        const role = getRoleFromToken(accessToken);
        if (role !== Role.ADMIN) {
          router.replace("/");
          return;
        }
      }

      router.replace(redirectPath);
      return;
    }

    // Nếu không có token -> redirect ngay (trừ login page)
    // Refresh token được lưu trong httpOnly cookie, không cần check ở đây
    if (!accessToken && !isLoginPage) {
      setShouldRedirect(true);
      return;
    }

    // Nếu có accessToken -> check role nếu là admin route
    if (accessToken) {
      if (isAdminRoute) {
        const role = getRoleFromToken(accessToken);
        if (isDev) {
          const decoded = accessToken ? decodeToken(accessToken) : null;
          console.log("🔍 Admin route check:", {
            role,
            expectedRole: Role.ADMIN,
            isAdmin: role === Role.ADMIN,
            pathname,
            decoded,
            payloadRoles: decoded?.roles,
          });
        }
        // Nếu không có role hoặc role không phải ADMIN -> redirect đến trang unauthorized
        if (!role || role !== Role.ADMIN) {
          if (isDev) {
            console.log(
              "❌ Not admin or no role, redirecting to /unauthorized"
            );
          }
          // Chỉ redirect nếu chưa ở trang unauthorized
          if (!isUnauthorizedPage) {
            router.replace("/unauthorized");
          }
          return;
        }
      }
      // Token có và role hợp lệ -> cho phép truy cập
      // API sẽ tự check expired và refresh nếu cần (refresh token trong cookie)
      if (isDev) {
        console.log(
          "✅ Token exists, allowing access (API will handle refresh)"
        );
      }
      return;
    }
    // Luôn check khi pathname thay đổi hoặc khi hydrate xong
    // Không cần check token expired vì API đã handle
  }, [
    pathname, // Luôn check khi pathname thay đổi
    hasHydrated, // Check khi hydrate xong
    accessToken,
    isAdminRoute,
    isLoginPage,
    router,
    searchParams,
  ]);

  // Redirect khi cần
  useEffect(() => {
    if (shouldRedirect && !pathname.startsWith("/login")) {
      const redirectPath = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectPath);
    }
  }, [shouldRedirect, pathname, router]);

  // isRefreshing = false vì không tự refresh ở đây
  // API sẽ tự refresh khi gọi, component chỉ cần check token
  return {
    isRefreshing: false,
    shouldRedirect,
  };
}
