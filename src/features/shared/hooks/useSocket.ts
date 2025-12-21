"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore, useIsAuthenticated } from "@/store";
import type { Socket } from "socket.io-client";

export function useSocket() {
  const { accessToken } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const newSocket = getSocket();
      socketRef.current = newSocket;

      if (newSocket) {
        console.log("🔍 [SOCKET] Socket state check:", {
          exists: !!newSocket,
          connected: newSocket.connected,
          disconnected: newSocket.disconnected,
          id: newSocket.id,
        });

        // Update state when socket connects
        const handleConnect = () => {
          console.log("✅ [useSocket] Socket connected, updating state");
          setSocket(newSocket);
        };

        // Update state immediately if already connected
        if (newSocket.connected) {
          setSocket(newSocket);
        } else {
          // Wait for connection
          newSocket.once("connect", handleConnect);
        }

        // Cleanup
        return () => {
          newSocket.off("connect", handleConnect);
        };
      }
    } else {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
        setSocket(null);
      }
    }
  }, [isAuthenticated, accessToken]);

  // Also listen to socket connection changes
  useEffect(() => {
    const currentSocket = socketRef.current;
    if (currentSocket) {
      const handleConnect = () => {
        setSocket(currentSocket);
      };

      const handleDisconnect = () => {
        setSocket(null);
      };

      currentSocket.on("connect", handleConnect);
      currentSocket.on("disconnect", handleDisconnect);

      return () => {
        currentSocket.off("connect", handleConnect);
        currentSocket.off("disconnect", handleDisconnect);
      };
    }
  }, [isAuthenticated, accessToken]);

  return socket || socketRef.current;
}
