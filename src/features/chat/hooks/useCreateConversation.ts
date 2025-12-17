"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../services/chat.api";
import type { Conversation, CreateConversationRequest } from "../types";
import { toast } from "sonner";

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationRequest>({
    mutationFn: (data) => chatApi.createConversation(data),
    onSuccess: (data) => {
      // Invalidate conversations list to refetch
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
}
