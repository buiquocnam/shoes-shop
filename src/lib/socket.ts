"use client";

import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function getToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export const getSocket = (): Socket | null => {
  const token = getToken();

  if (!token) {
    console.warn("No access token available for socket connection");
    return null;
  }

  if (!socket || !socket.connected) {
    const socketUrl = `http://localhost:8084?token=${token}`;

    socket = io(socketUrl, {
      autoConnect: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    });

    socket.on("connect", () => {
      reconnectAttempts = 0;
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io client disconnect") {
        reconnectAttempts = 0;
      }
    });

    const currentSocket = socket;

    currentSocket.on("connect_error", (error) => {
      reconnectAttempts++;

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

    currentSocket.io.on("reconnect_failed", () => {
      reconnectAttempts = 0;
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
