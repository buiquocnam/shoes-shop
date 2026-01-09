"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../../services/chat.api";
import type { Message, CreateMessageRequest } from "../../types";
import { toast } from "sonner";
import { useSocketStore } from "@/store";

/**
 * Hook to send a message
 * Sends message via API and emits via socket
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const socket = useSocketStore((state) => state.socket);

  return useMutation<Message, Error, CreateMessageRequest>({
    mutationFn: (data) => {
      return chatApi.sendMessage(data);
    },
    onSuccess: (data, variables) => {
      // Update local cache immediately for optimistic UI update
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", variables.conversationId],
        (oldData) => {
          if (!oldData) return [data];
          // Check for duplicates before adding
          const exists = oldData.some((msg) => msg.id === data.id);
          if (exists) return oldData;
          // Add new message to the end (newest at bottom)
          return [...oldData, data];
        }
      );

      // Invalidate conversations list to update latest message preview
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });

      // Emit message via socket
      if (socket && socket.connected) {
        console.log("📡 [SOCKET] Emitting 'message' event:", {
          event: "message",
          data: data,
        });
        socket.emit("message", data);
      } else {
        console.warn("⚠️ [SOCKET] Socket not connected, cannot emit message");
      }
    },
    onError: (error) => {
      console.error("❌ [SOCKET] Failed to send message:", error);
      toast.error(error.message || "Gửi tin nhắn thất bại");
    },
  });
}
