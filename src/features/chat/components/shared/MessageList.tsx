"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks";
import { cn } from "@/lib/utils";
import type { Message } from "../../types";
import { User, CheckCheck } from "lucide-react";

interface MessageListProps {
  conversationId: string | null;
  className?: string;
}

export function MessageList({ conversationId, className }: MessageListProps) {
  const { data: messages = [], isLoading } = useMessages(conversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Auto-scroll when conversation changes
  useEffect(() => {
    if (conversationId && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [conversationId]);

  if (!conversationId) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full",
          className
        )}
      >
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full",
          className
        )}
      >
        <div className="text-center space-y-3">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Chưa có tin nhắn</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Hãy bắt đầu cuộc trò chuyện!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sort messages by createdDate ascending (oldest first, newest last)
  // This ensures new messages appear at the bottom
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdDate || 0).getTime();
    const dateB = new Date(b.createdDate || 0).getTime();
    return dateA - dateB;
  });

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdDate || "").toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: currentDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(sortedMessages);

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-4 p-6 overflow-y-auto h-full bg-gradient-to-b from-background to-muted/20",
        className
      )}
    >
      {messageGroups.map((group, groupIndex) => (
        <div key={group.date + groupIndex}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
              {group.date}
            </div>
          </div>

          {/* Messages in this group */}
          {group.messages.map((message: Message, msgIndex: number) => {
            const isOwnMessage = message.me;
            const prevMessage = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
            const nextMessage = msgIndex < group.messages.length - 1 ? group.messages[msgIndex + 1] : null;

            // Show avatar only for received messages, when it's the first message or previous message is from different sender
            const showAvatar = !isOwnMessage && (
              !prevMessage ||
              prevMessage.me ||
              prevMessage.senderId !== message.senderId
            );

            // Show time for last message in group or when there's a significant time gap
            const showTime = msgIndex === group.messages.length - 1 ||
              (nextMessage &&
                new Date(nextMessage.createdDate || "").getTime() -
                new Date(message.createdDate || "").getTime() > 300000); // 5 minutes

            return (
              <div
                key={message.id || `${message.senderId}-${message.createdDate}`}
                className={cn(
                  "flex gap-2 group mb-2",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                {/* Avatar for received messages - only show when needed */}
                {!isOwnMessage && (
                  <div className="flex-shrink-0 w-8 h-8 mt-auto">
                    {showAvatar ? (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    isOwnMessage ? "items-end" : "items-start"
                  )}
                >
                  {!isOwnMessage && showAvatar && (
                    <div className="text-xs font-medium text-foreground mb-1 px-1">
                      {message.senderName}
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 shadow-sm",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    )}
                  >
                    <div className={cn(
                      "text-sm whitespace-pre-wrap break-words",
                      isOwnMessage ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {message.message}
                    </div>
                    {showTime && (
                      <div className={cn(
                        "flex items-center gap-1 mt-1.5 text-xs",
                        isOwnMessage ? "text-primary-foreground/70 justify-end" : "text-muted-foreground justify-start"
                      )}>
                        <span>{formatTime(message.createdDate)}</span>
                        {isOwnMessage && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
