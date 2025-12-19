"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import type { Message, CreateMessageRequest } from "../../types";
import { toast } from "sonner";

// Hook to send a message to a conversation
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, CreateMessageRequest>({
    mutationFn: (data) => chatApi.sendMessage(data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", variables.conversationId],
        (oldData) => {
          if (!oldData) return [data];
          return [...oldData, data];
        }
      );
      // Invalidate conversations list to update preview
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
      // Note: Socket will also emit the message, so we update cache immediately
      // and socket will handle real-time updates for other users
    },
    onError: (error) => {
      toast.error(error.message || "Gửi tin nhắn thất bại");
    },
  });
}
