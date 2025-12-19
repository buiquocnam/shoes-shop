"use client";

import { useEffect, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store";
import type { Socket } from "socket.io-client";

export function useSocket() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      socketRef.current = getSocket();
    } else {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
    }
  }, [isAuthenticated, accessToken]);

  return socketRef.current;
}