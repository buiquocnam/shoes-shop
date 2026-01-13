"use client";

import { MessageSquare } from "lucide-react";
import { useConversation } from "../../hooks";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChatListItem } from "./ChatListItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
  onSelectConversation: (conversationId: string, conversationName: string) => void;
  selectedConversationId?: string | null;
  className?: string;
}

export function ChatList({
  onSelectConversation,
  selectedConversationId,
  className,
}: ChatListProps) {
  // Now getting a list of Conversations, not messages
  const { data: conversations = [], isLoading } = useConversation();
  const [searchQuery, setSearchQuery] = useState("");

  // Sort conversations by modifiedDate
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
  });

  // Simple search by conversation name (client-side filtering)
  const filteredConversations = searchQuery.trim()
    ? sortedConversations.filter((c) =>
      c.conversationName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : sortedConversations;

  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full bg-background", className)}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Cuộc trò chuyện</h2>
        </div>
        <div className="flex-1 flex flex-col gap-2 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <h2 className="text-lg font-semibold">Cuộc trò chuyện</h2>
        <Input
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {searchQuery
                ? "Không tìm thấy cuộc trò chuyện"
                : "Chưa có cuộc trò chuyện nào"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredConversations.map((conv) => (
              <ChatListItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                onSelect={onSelectConversation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
