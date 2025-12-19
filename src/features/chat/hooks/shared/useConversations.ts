"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import type { Message } from "../../types";
import { useSocketConversations } from "./useSocketMessages";

/**
 * Hook to get all conversations for the current user
 * Uses /chat/messages/user endpoint which auto-detects userId from JWT
 * Uses socket for real-time updates instead of polling
 */
export function useConversations() {
  // Listen for new messages via socket
  useSocketConversations();

  return useQuery<Message[]>({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatApi.getMessagesByUserId(),
    staleTime: 60 * 1000, // 1 minute
  });
}
