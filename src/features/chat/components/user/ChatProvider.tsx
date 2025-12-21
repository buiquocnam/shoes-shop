"use client";

import { useState, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatModal } from "./ChatModal";
import { useAuthStore, useIsAuthenticated } from "@/store";
import { Role } from "@/types/global";
import { disconnectSocket, getSocket } from "@/lib/socket";

export function ChatProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, accessToken } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // ❌ chưa login / admin → không connect
    if (!isAuthenticated || !user || user.role === Role.ADMIN) {
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
  }, [isAuthenticated, user, accessToken]);

  // UI guard
  if (!isAuthenticated || !user || user.role === Role.ADMIN) {
    return null;
  }

  return (
    <>
      <ChatBubble onClick={() => setIsOpen(true)} />
      <ChatModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}


