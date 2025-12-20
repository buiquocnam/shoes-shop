"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import type { Message } from "../../types";

/**
 * Hook to listen for new messages via socket for a specific conversation
 */
export function useSocketMessages(conversationId: string | null) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) {
      console.log("⚠️ [SOCKET] Cannot setup listener:", {
        hasSocket: !!socket,
        hasConversationId: !!conversationId,
        socketConnected: socket?.connected,
      });
      return;
    }

    const handleNewMessage = (data: string | Message) => {
      // Backend sends JSON string, need to parse it
      let message: Message;
      
      try {
        if (typeof data === "string") {
          message = JSON.parse(data) as Message;
          console.log("📨 [SOCKET] Parsed JSON string to Message:", message);
        } else {
          message = data;
        }
      } catch (error) {
        console.error("❌ [SOCKET] Failed to parse message:", error, { data });
        return;
      }

      console.log("📨 [SOCKET] Received 'message' event:", {
        messageId: message.id,
        conversationId: message.conversationId,
        currentConversationId: conversationId,
        matches: message.conversationId === conversationId,
      });

      // Only process messages for current conversation
      if (message.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(
          ["chat", "messages", conversationId],
          (oldData) => {
            if (!oldData) return [message];
            // Prevent duplicates
            const exists = oldData.some((msg) => msg.id === message.id);
            if (exists) return oldData;
            // Add to end (newest at bottom)
            return [...oldData, message];
          }
        );
        console.log("✅ [SOCKET] Message added to conversation cache");
      }

      // Always invalidate conversations list to update latest message
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    };

    // Setup listener when socket is connected
    const setupListener = () => {
      if (socket.connected) {
        socket.on("message", handleNewMessage);
        
        console.log("👂 [SOCKET] Listening for 'message' event (conversation)", {
          socketId: socket.id,
          conversationId,
          connected: socket.connected,
        });
      }
    };

    // Setup immediately if already connected
    if (socket.connected) {
      setupListener();
    } else {
      // Wait for connection
      socket.once("connect", setupListener);
      console.log("⏳ [SOCKET] Waiting for socket connection before listening...");
    }

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("connect", setupListener);
    };
  }, [socket, conversationId, queryClient]);
}

/**
 * Hook to listen for all new messages (for conversations list)
 * Used to update conversation list when any message is received
 */
export function useSocketConversations() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ [SOCKET] Cannot setup conversations listener: no socket");
      return;
    }

    const handleNewMessage = (data: string | Message) => {
      // Backend sends JSON string, need to parse it
      let message: Message;
      
      try {
        if (typeof data === "string") {
          message = JSON.parse(data) as Message;
          console.log("📨 [SOCKET] Parsed JSON string to Message (conversations list):", message);
        } else {
          message = data;
        }
      } catch (error) {
        console.error("❌ [SOCKET] Failed to parse message:", error, { data });
        return;
      }

      console.log("📨 [SOCKET] Received 'message' event (conversations list):", {
        messageId: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        me: message.me,
      });

      // Update conversations list
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });

      // Also update the specific conversation's messages if it exists in cache
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", message.conversationId],
        (oldData) => {
          if (!oldData) return [message];
          // Prevent duplicates
          const exists = oldData.some((msg) => msg.id === message.id);
          if (exists) return oldData;
          // Add to end (newest at bottom)
          return [...oldData, message];
        }
      );
      
      console.log("✅ [SOCKET] Message processed and cache updated");
    };

    // Setup listener when socket is connected
    const setupListener = () => {
      if (socket && socket.connected) {
        // Remove any existing listener first to avoid duplicates
        socket.off("message", handleNewMessage);
        
        socket.on("message", handleNewMessage);
        console.log("👂 [SOCKET] Listening for 'message' event (conversations list)", {
          socketId: socket.id,
          connected: socket.connected,
        });
      } else {
        console.warn("⚠️ [SOCKET] Socket not connected when trying to setup listener", {
          hasSocket: !!socket,
          connected: socket?.connected,
        });
      }
    };

    // Setup immediately if already connected
    if (socket && socket.connected) {
      setupListener();
    } else if (socket) {
      // Wait for connection - use 'on' instead of 'once' to handle reconnects
      socket.on("connect", setupListener);
      console.log("⏳ [SOCKET] Waiting for socket connection before listening...", {
        socketId: socket.id,
        connected: socket.connected,
      });
    } else {
      console.warn("⚠️ [SOCKET] No socket available for conversations listener");
    }

    return () => {
      if (socket) {
        socket.off("message", handleNewMessage);
        socket.off("connect", setupListener);
        console.log("🧹 [SOCKET] Cleaned up conversations listener");
      }
    };
  }, [socket, queryClient]);
}
