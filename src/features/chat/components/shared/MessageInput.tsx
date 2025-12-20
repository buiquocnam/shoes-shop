"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "../../hooks";
import { useAuthStore } from "@/store";
import type { CreateMessageRequest } from "../../types";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  conversationId: string;
  onMessageSent?: () => void;
  className?: string;
}

export function MessageInput({
  conversationId,
  onMessageSent,
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const messageData: CreateMessageRequest = {
      conversationId,
      message: message.trim(),
      senderId: user.id,
      senderName: user.name,
    };

    sendMessage(messageData, {
      onSuccess: () => {
        setMessage("");
        onMessageSent?.();
      },
    });
  };

  return (
    <div className={cn("border-t bg-card", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-end p-4"
      >
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className={cn(
              "min-h-[52px] max-h-[120px] resize-none pr-12",
              "border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isPending}
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            onClick={() => {
              // TODO: Add emoji picker
            }}
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isPending}
          className={cn(
            "h-[52px] w-[52px] shrink-0",
            "bg-primary hover:bg-primary/90",
            "transition-all duration-200",
            !message.trim() && "opacity-50"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
      <div className="px-4 pb-2">
        <p className="text-xs text-muted-foreground">
          Nhấn Enter để gửi, Shift + Enter để xuống dòng
        </p>
      </div>
    </div>
  );
}
