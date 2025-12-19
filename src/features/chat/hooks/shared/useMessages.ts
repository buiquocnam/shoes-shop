"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import type { Message } from "../../types";
import { useSocketMessages } from "./useSocketMessages";

/**
 * Hook to get messages by conversation ID
 * Uses socket for real-time updates instead of polling
 */
export function useMessages(conversationId: string | null) {
  // Listen for new messages via socket
  useSocketMessages(conversationId);

  return useQuery<Message[]>({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => chatApi.getMessagesByConversationId(conversationId!),
    enabled: !!conversationId,
    staleTime: 60 * 1000, // 1 minute
    // Removed refetchInterval - using socket for real-time updates
  });
}
