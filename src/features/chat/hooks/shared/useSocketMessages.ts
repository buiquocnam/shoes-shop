"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import type { Message } from "../../types";

// Hook to listen for new messages via socket
export function useSocketMessages(conversationId: string | null) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(
          ["chat", "messages", conversationId],
          (oldData) => {
            if (!oldData) return [message];
            const exists = oldData.some((msg) => msg.id === message.id);
            if (exists) return oldData;
            return [...oldData, message];
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);
}

// Hook to listen for all new messages (for conversations list)
export function useSocketConversations() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });

      queryClient.setQueryData<Message[]>(
        ["chat", "messages", message.conversationId],
        (oldData) => {
          if (!oldData) return [message];
          const exists = oldData.some((msg) => msg.id === message.id);
          if (exists) return oldData;
          return [...oldData, message];
        }
      );
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, queryClient]);
}
