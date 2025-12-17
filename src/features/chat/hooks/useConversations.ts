"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../services/chat.api";
import type { Message } from "../types";

/**
 * Hook to get all conversations for the current user
 * Uses /chat/messages/user endpoint which auto-detects userId from JWT
 */
export function useConversations() {
  return useQuery<Message[]>({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatApi.getMessagesByUserId(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for real-time updates
  });
}
