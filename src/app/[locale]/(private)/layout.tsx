"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useIsAdmin } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";
import { SideBarAdmin } from "@/features/admin/components";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isAdmin = useIsAdmin();
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const isAdminRoute = pathname.startsWith("/admin");
    const isUnauthorizedPage = pathname === "/unauthorized";

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isUnauthorizedPage) return;
        if (!hasHydrated) return;

        if (!isAdmin) {
            router.replace("/unauthorized");
        }
    }, [isAdmin, isUnauthorizedPage, router, hasHydrated]);

    if (isAdminRoute && !isUnauthorizedPage) {
        if (!hasHydrated) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">
                            Đang tải...
                        </p>
                    </div>
                </div>
            );
        }

        // Đã hydrate nhưng không phải admin -> đang redirect (hiển thị loading trong lúc redirect)
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

    return (
        <SidebarProvider>
            <SideBarAdmin />
            <main className="w-full">
                {children}
            </main>

        </SidebarProvider>

    );
};

export default Layout;
