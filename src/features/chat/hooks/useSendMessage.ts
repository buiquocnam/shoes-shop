"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../services/chat.api";
import type { Message, CreateMessageRequest } from "../types";
import { toast } from "sonner";

/**
 * Hook to send a message to a conversation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, CreateMessageRequest>({
    mutationFn: (data) => chatApi.sendMessage(data),
    onSuccess: (data, variables) => {
      // Invalidate messages for this conversation to refetch
      queryClient.invalidateQueries({
        queryKey: ["chat", "messages", variables.conversationId],
      });
      // Also invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
}

