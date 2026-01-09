"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import { useSocketMessages } from "./useSocketMessages";

/**
 * Hook to get messages by conversation ID
 * Uses React Query for history and socket for live patches
 */
export function useMessages(conversationId: string | null) {
  // Setup real-time listener (patches cache)
  useSocketMessages(conversationId);

  return useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => chatApi.getMessagesByConversationId(conversationId!),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
