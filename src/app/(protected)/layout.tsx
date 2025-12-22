"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";

const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const accessToken = useAuthStore((state) => state.accessToken);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!hasHydrated) return; 

        if (!accessToken) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [accessToken, pathname, router, hasHydrated]);

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

    if (!accessToken) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default Layout;