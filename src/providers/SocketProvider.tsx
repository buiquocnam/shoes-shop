"use client";

import { useEffect } from "react";
import { useAuthStore, useSocketStore } from "@/store";

interface SocketProviderProps {
    children: React.ReactNode;
}

/**
 * SocketProvider manages the global socket connection lifecycle
 * based on the authentication state from AuthStore.
 */
export function SocketProvider({ children }: SocketProviderProps) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const { connect, disconnect } = useSocketStore();

    useEffect(() => {
        if (accessToken) {
            connect(accessToken);
        } else {
            disconnect();
        }
    }, [accessToken, connect, disconnect]);

    return <>{children}</>;
}
