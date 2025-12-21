"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";

/**
 * Protected routes layout
 * - Check token và redirect nếu không có token
 * - Chặn render children cho đến khi có token
 */
const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Nếu không có token -> redirect login
        if (!accessToken) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [accessToken, pathname, router]);

    // Chưa có token → hiển thị loading (đang redirect)
    if (!accessToken) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    // Có token → render children
    return <>{children}</>;
};

export default Layout;