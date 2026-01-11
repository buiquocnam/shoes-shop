"use client";

import { useState } from "react";
import { ChatList, ChatWindow } from "@/features/chat";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [selectedConversationName, setSelectedConversationName] =
    useState<string>("");

  // Socket is now centrally managed by AppInitializer

  const handleSelectConversation = (
    conversationId: string,
    conversationName: string
  ) => {
    setSelectedConversationId(conversationId);
    setSelectedConversationName(conversationName);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="border-b bg-card px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản lý trò chuyện</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý và hỗ trợ khách hàng qua tin nhắn
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-0 overflow-hidden min-h-0">
        <div className="border-r bg-muted/30 overflow-hidden min-h-0">
          <ChatList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
          />
        </div>
        <div className="bg-background overflow-hidden min-h-0 flex flex-col">
          <ChatWindow
            conversationId={selectedConversationId}
            conversationName={selectedConversationName}
          />
        </div>
      </div>
    </div>
  );
}


