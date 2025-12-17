"use client";

import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversationId: string | null;
  className?: string;
}

export function ChatWindow({
  conversationId,
  className,
}: ChatWindowProps) {
  return (
    <Card className={cn("flex flex-col h-full border-0 shadow-none", className)}>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MessageList conversationId={conversationId} />
        </div>
        {conversationId && (
          <MessageInput
            conversationId={conversationId}
            className="mt-auto"
          />
        )}
      </CardContent>
    </Card>
  );
}
