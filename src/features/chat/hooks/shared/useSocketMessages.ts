"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "@/store";
import type { Message } from "../../types";

/**
 * Hook to listen for new messages via socket for a specific conversation
 * Patches React Query cache directly for real-time updates
 */
export function useSocketMessages(conversationId: string | null) {
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (data: string | Message) => {
      let message: Message;
      
      try {
        if (typeof data === "string") {
          message = JSON.parse(data) as Message;
        } else {
          message = data;
        }
      } catch (error) {
        console.error("❌ [SOCKET] Failed to parse message:", error, { data });
        return;
      }

      // 1. Update active conversation messages cache
      if (message.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(
          ["chat", "messages", conversationId],
          (oldData) => {
            if (!oldData) return [message];
            // Prevent duplicates
            if (oldData.some((msg) => msg.id === message.id)) return oldData;
            return [...oldData, message];
          }
        );
      }

      // 2. Always update conversations list cache (the latest message for this conversation)
      queryClient.setQueryData<Message[]>(
        ["chat", "conversations"],
        (oldData) => {
          if (!oldData) return [message];
          
          // Remove old entry for this conversation if exists
          const filteredData = oldData.filter(m => m.conversationId !== message.conversationId);
          // Add new message to top (sorted by recency)
          return [message, ...filteredData];
        }
      );
    };

    // Socket.io listeners are persistent if setup once. 
    // We cleanup old listener and add new one to avoid double handling.
    socket.off("message", handleNewMessage);
    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);
}

/**
 * Hook to listen for all new messages (global listener for notifications or lists)
 */
export function useSocketConversations() {
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: string | Message) => {
      let message: Message;
      
      try {
        if (typeof data === "string") {
          message = JSON.parse(data) as Message;
        } else {
          message = data;
        }
      } catch (error) {
        return;
      }

      // Update conversations list (the source for ChatList)
      queryClient.setQueryData<Message[]>(
        ["chat", "conversations"],
        (oldData) => {
          if (!oldData) return [message];
          const filteredData = oldData.filter(m => m.conversationId !== message.conversationId);
          return [message, ...filteredData];
        }
      );
      
      // Also patch the specific conversation if it happens to be open in cache
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", message.conversationId],
        (oldData) => {
          if (!oldData) return undefined; // Don't create if not exists
          if (oldData.some((msg) => msg.id === message.id)) return oldData;
          return [...oldData, message];
        }
      );
    };

    socket.off("message", handleNewMessage);
    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, queryClient]);
}
