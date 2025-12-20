"use client";

import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const SOCKET_URL = "http://localhost:8099";

function getToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/**
 * Get or create socket instance with authentication
 * Uses auth object instead of query param for better security
 */
export const getSocket = (): Socket | null => {
  const token = getToken();

  if (!token) {
    console.warn("No access token available for socket connection");
    return null;
  }

  // Reuse existing socket if connected
  if (socket && socket.connected) {
    return socket;
  }

  // Create new socket connection
  socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    // Use auth object for authentication (more secure than query param)
    auth: {
      token: token,
    },
  });

  // Connection event handlers
  socket.on("connect", () => {
    reconnectAttempts = 0;
    console.log("✅ Socket connected", socket?.id || "No ID");
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected", reason);
    if (reason === "io client disconnect") {
      reconnectAttempts = 0;
    }
  });

  socket.on("connect_error", (error) => {
    reconnectAttempts++;
    console.error("Socket connection error:", error.message);

    // Retry with updated token if unauthorized
    if (error.message === "Unauthorized" && socket) {
      const newToken = getToken();
      if (newToken) {
        socket.auth = { token: newToken };
        socket.connect();
      }
    }

    // Stop reconnecting after max attempts
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error(
        "Socket connection failed after",
        MAX_RECONNECT_ATTEMPTS,
        "attempts"
      );
      if (socket) {
        socket.disconnect();
      }
      socket = null;
      reconnectAttempts = 0;
    }
  });

  socket.io.on("reconnect_failed", () => {
    console.error("Socket reconnect failed");
    reconnectAttempts = 0;
  });

  return socket;
};

/**
 * Disconnect socket and cleanup
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};
