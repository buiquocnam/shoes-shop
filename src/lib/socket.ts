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
 * Passes token as query parameter (backend reads from handshake URL params)
 */
export const getSocket = (): Socket | null => {
  const token = getToken();

  if (!token) {
    console.warn("No access token available for socket connection");
    return null;
  }

  // Check if we need to recreate socket (token changed or not connected)
  const currentToken = socket?.io?.opts?.query?.token as string | undefined;
  const tokenChanged = currentToken !== token;
  
  // Reuse existing socket if connected and token hasn't changed
  if (socket && socket.connected && !tokenChanged) {
    return socket;
  }

  // Disconnect old socket if token changed or not connected
  if (socket && (tokenChanged || !socket.connected)) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  // Create new socket connection
  // Backend reads token from query parameter: getHandshakeData().getSingleUrlParam("token")
  socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    // Pass token as query parameter (backend requirement)
    query: {
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
    // Need to recreate socket with new token (query params can't be changed on existing socket)
    if (error.message === "Unauthorized" && socket) {
      const newToken = getToken();
      if (newToken) {
        // Disconnect and recreate socket with new token
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        reconnectAttempts = 0;
        // Recreate socket with new token
        setTimeout(() => {
          getSocket();
        }, 500);
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
