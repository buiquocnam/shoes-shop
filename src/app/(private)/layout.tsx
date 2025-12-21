"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useIsAdmin } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";

/**
 * Private routes layout (admin routes)
 * - Check role ADMIN và redirect nếu không phải admin
 * - Không render children cho đến khi đã check role
 */
const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isAdmin = useIsAdmin();
    const isAdminRoute = pathname.startsWith("/admin");
    const isUnauthorizedPage = pathname === "/unauthorized";

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isUnauthorizedPage) return;
        // Check role ADMIN
        if (!isAdmin) {
            router.replace("/unauthorized");
        }
    }, [isAdmin, isUnauthorizedPage, router]);

    // Đang ở admin route -> check role trước khi render
    if (isAdminRoute && !isUnauthorizedPage) {
        // Chưa có token hoặc không phải admin -> không render (đang redirect)
        if (!isAdmin) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">
                            Đang kiểm tra quyền truy cập...
                        </p>
                    </div>
                </div>
            );
        }
    }

    // Đã check và được phép -> render children
    return <>{children}</>;
};

export default Layout;
