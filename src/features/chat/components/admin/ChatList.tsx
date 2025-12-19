"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "../../hooks";
import { cn } from "@/lib/utils";
import type { Message } from "../../types";

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

  const conversations = Array.from(conversationsMap.values()).reverse();

  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Đang tải cuộc trò chuyện...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardContent className="p-4 border-b">
        <h2 className="text-lg font-semibold">Cuộc trò chuyện</h2>
      </CardContent>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Chưa có cuộc trò chuyện nào.
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((conv) => {
              const { latestMessage, otherParticipantName } = conv;
              const isOwnMessage = latestMessage.me;
              const displayName = otherParticipantName || "Trò chuyện";
              const previewMessage = isOwnMessage
                ? `Bạn: ${latestMessage.message}`
                : latestMessage.message;

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
                    "flex items-center gap-3 p-4 text-left hover:bg-muted transition-colors border-b cursor-pointer",
                    selectedConversationId === latestMessage.conversationId &&
                    "bg-muted"
                  )}
                >
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{displayName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {previewMessage}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
