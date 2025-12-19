"use client";

import { useState, useEffect } from "react";
import { ChatList, ChatWindow } from "@/features/chat";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [selectedConversationName, setSelectedConversationName] =
    useState<string>("");
  const { isAuthenticated, accessToken } = useAuthStore();

  // Connect socket for admin chat
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();
    if (socket && !socket.connected) {
      socket.connect();
    }

    socket?.on("connect", () => {
      console.log("✅ Admin chat socket connected", socket.id);
    });

    socket?.on("disconnect", () => {
      console.log("❌ Admin chat socket disconnected");
    });

    socket?.on("connect_error", async (err) => {
      if (err.message === "Unauthorized") {
        socket.auth = {
          token: accessToken,
        };
        socket.connect();
      }
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("connect_error");
    };
  }, [isAuthenticated, accessToken]);

  const handleSelectConversation = (
    conversationId: string,
    conversationName: string
  ) => {
    setSelectedConversationId(conversationId);
    setSelectedConversationName(conversationName);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý trò chuyện</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý tất cả cuộc trò chuyện
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1">
          <ChatList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
          />
        </div>
        <div className="lg:col-span-2">
          <ChatWindow
            conversationId={selectedConversationId}
          />
        </div>
      </div>
    </div>
  );
}


