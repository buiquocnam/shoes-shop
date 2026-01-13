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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

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
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        onMessageSent?.();
      },
    });
  };

  return (
    <div className={cn(" bg-card", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-end p-4"
      >
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className={cn(
              "min-h-[52px] max-h-[200px] resize-none pr-4 py-3 overflow-y-auto",
              "border-2 focus-visible:ring-2 focus-visible:ring-primary/20",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30"
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
