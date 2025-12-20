"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import type { Message } from "../../types";

/**
 * Hook to listen for new messages via socket for a specific conversation
 */
export function useSocketMessages(conversationId: string | null) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      // Only process messages for current conversation
      if (message.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(
          ["chat", "messages", conversationId],
          (oldData) => {
            if (!oldData) return [message];
            // Prevent duplicates
            const exists = oldData.some((msg) => msg.id === message.id);
            if (exists) return oldData;
            // Add to end (newest at bottom)
            return [...oldData, message];
          }
        );
      }

      // Always invalidate conversations list to update latest message
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    };
    socket.on("message", handleNewMessage);
    console.log("👂 [SOCKET] Listening for 'message' event (conversation)");

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);
}

/**
 * Hook to listen for all new messages (for conversations list)
 * Used to update conversation list when any message is received
 */
export function useSocketConversations() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Update conversations list
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });

      // Also update the specific conversation's messages if it exists in cache
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", message.conversationId],
        (oldData) => {
          if (!oldData) return [message];
          // Prevent duplicates
          const exists = oldData.some((msg) => msg.id === message.id);
          if (exists) return oldData;
          // Add to end (newest at bottom)
          return [...oldData, message];
        }
      );
    };
    console.log("👂 [SOCKET] Listening for 'message' event (conversations list)");
    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, queryClient]);
}
