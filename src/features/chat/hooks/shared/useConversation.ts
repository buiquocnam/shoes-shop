"use client";

import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import { useSocketConversations } from "./useSocketMessages";

export function useConversation() {
  useSocketConversations();

  return useQuery({
    queryKey: ["chat", "conversations-list"],
    queryFn: () => chatApi.getConversationsList(),
    staleTime: 5 * 60 * 1000,
  });
}
