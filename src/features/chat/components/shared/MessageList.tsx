"use client";

import { useMessages } from "../../hooks";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Message } from "../../types";

interface MessageListProps {
  conversationId: string | null;
  className?: string;
}

export function MessageList({ conversationId, className }: MessageListProps) {
  const { data: messages, isLoading } = useMessages(conversationId);

  if (!conversationId) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground",
          className
        )}
      >
        Chọn một cuộc trò chuyện để bắt đầu
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground",
          className
        )}
      >
        Đang tải tin nhắn...
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground",
          className
        )}
      >
        Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
      </div>
    );
  }

  const sortedMessages = [...messages].reverse();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 overflow-y-auto h-full",
        className
      )}
    >
      {sortedMessages.map((message: Message) => {
        const isOwnMessage = message.me;

        return (
          <div
            key={message.id || `${message.senderId}-${message.createdDate}`}
            className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
          >
            <Card
              className={cn(
                "max-w-[70%] p-3",
                isOwnMessage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {!isOwnMessage && (
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {message.senderName}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.message}
              </div>
              <div
                className={cn(
                  "text-xs mt-1 opacity-70",
                  isOwnMessage ? "text-right" : "text-left"
                )}
              >
                {new Date(message.createdDate || "").toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
