"use client";

import { MessageSquare, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "../../hooks";
import { cn } from "@/lib/utils";
import type { Message } from "../../types";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

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
  const { data: messages, isLoading } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique conversations from messages
  // Group messages by conversationId and get the latest message for each conversation
  // Also track the other participant's name (not the current user)
  const conversationsMap = new Map<
    string,
    { latestMessage: Message; otherParticipantName: string }
  >();

  if (messages) {
    messages.forEach((msg: Message) => {
      const existing = conversationsMap.get(msg.conversationId);
      const isNewer =
        !existing ||
        (msg.createdDate &&
          existing.latestMessage.createdDate &&
          new Date(msg.createdDate) > new Date(existing.latestMessage.createdDate));


      const otherParticipantName =
        !msg.me
          ? msg.senderName
          : existing?.otherParticipantName || "Không xác định";

      if (isNewer) {
        conversationsMap.set(msg.conversationId, {
          latestMessage: msg,
          otherParticipantName,
        });
      } else if (!msg.me && !existing?.otherParticipantName) {
        // Update otherParticipantName if we found it
        conversationsMap.set(msg.conversationId, {
          latestMessage: existing.latestMessage,
          otherParticipantName: msg.senderName,
        });
      }
    });
  }

  let conversations = Array.from(conversationsMap.values()).reverse();

  // Filter conversations by search query
  if (searchQuery.trim()) {
    conversations = conversations.filter((conv) => {
      const displayName = conv.otherParticipantName || "Trò chuyện";
      const previewMessage = conv.latestMessage.me
        ? `Bạn: ${conv.latestMessage.message}`
        : conv.latestMessage.message;
      return (
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        previewMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  // Format time helper
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full bg-background", className)}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Cuộc trò chuyện</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            Đang tải cuộc trò chuyện...
          </div>
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
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {searchQuery ? "Không tìm thấy cuộc trò chuyện" : "Chưa có cuộc trò chuyện nào"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((conv) => {
              const { latestMessage, otherParticipantName } = conv;
              const isOwnMessage = latestMessage.me;
              const displayName = otherParticipantName || "Khách hàng";
              const previewMessage = isOwnMessage
                ? `Bạn: ${latestMessage.message}`
                : latestMessage.message;
              const isSelected = selectedConversationId === latestMessage.conversationId;
              const timeAgo = formatTime(latestMessage.createdDate);

              return (
                <button
                  key={latestMessage.conversationId}
                  onClick={() => {
                    onSelectConversation(
                      latestMessage.conversationId,
                      displayName
                    );
                  }}
                  className={cn(
                    "flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b cursor-pointer group relative",
                    isSelected && "bg-primary/5"
                  )}
                  style={isSelected ? { borderLeft: "4px solid hsl(var(--primary))" } : undefined}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center",
                      isSelected ? "bg-primary/20" : "bg-muted"
                    )}>
                      <User className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    {!isOwnMessage && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className={cn(
                        "font-semibold truncate",
                        isSelected && "text-primary"
                      )}>
                        {displayName}
                      </div>
                      {timeAgo && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
                          <Clock className="h-3 w-3" />
                          <span>{timeAgo}</span>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "text-sm truncate",
                      isSelected ? "text-foreground/80" : "text-muted-foreground"
                    )}>
                      {previewMessage}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
