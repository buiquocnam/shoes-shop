"use client";

import { useState } from "react";
import { ChatList, ChatWindow } from "@/features/chat";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [selectedConversationName, setSelectedConversationName] =
    useState<string>("");

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
        <h1 className="text-3xl font-bold">Chat Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all conversations
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

