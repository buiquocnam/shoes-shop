"use client";

import { useEffect } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore, useIsAuthenticated } from "@/store";

/**
 * Hook to setup socket connection for chat
 * Used by both admin and user chat components
 */
export function useChatSocket() {
  const { accessToken } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("✅ Chat socket connected", socket?.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Chat socket disconnected");
    };

    const handleConnectError = async (err: Error) => {
      // Error handling is done in socket.ts getSocket() function
      // It will automatically recreate socket with new token if needed
      console.error("Chat socket connection error:", err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
      }
    };
  }, [isAuthenticated, accessToken]);
}
