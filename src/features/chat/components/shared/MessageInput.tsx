"use client";

import { useState } from "react";
import { Send } from "lucide-react";
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
    <form
      onSubmit={handleSubmit}
      className={cn("flex gap-2 items-end border-t p-4 ", className)}
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn của bạn..."
        className="min-h-[60px] max-h-[120px] resize-none  "
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        disabled={isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isPending}
        className="h-[60px] w-[60px] shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
