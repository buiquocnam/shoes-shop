"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../services/chat.api";
import type { Message } from "../types";

/**
 * Hook to get messages by conversation ID
 */
export function useMessages(conversationId: string | null) {
  return useQuery<Message[]>({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => chatApi.getMessagesByConversationId(conversationId!),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 5 * 1000, // Refetch every 5 seconds for real-time updates
  });
}
