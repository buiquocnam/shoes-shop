"use client";

import { ReactNode } from 'react';
import { useAuthGuard } from '@/hooks';
import { usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
const Layout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { shouldRender, hasHydrated } = useAuthGuard(pathname);

    if (!hasHydrated || !shouldRender) {
        return <div className="flex justify-center items-center h-screen">
            <Spinner className="size-8" />
        </div>;
    }

    return <>{children}</>;
};

export default Layout;