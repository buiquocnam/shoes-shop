"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import { useSocketConversations } from "./useSocketMessages";

/**
 * Hook to get all conversations for the current user
 */
export function useConversations() {
  // Setup real-time listener for entire list
  useSocketConversations();

  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatApi.getMessagesByUserId(),
    staleTime: 5 * 60 * 1000,
  });
}
