"use client";

import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { cn } from "@/lib/utils";
import { User, Circle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatWindowProps {
  conversationId: string | null;
  conversationName?: string;
  className?: string;
}

export function ChatWindow({
  conversationId,
  conversationName,
  className,
}: ChatWindowProps) {
  return (
    <div className={cn("flex flex-col h-full w-full min-h-0", className)}>
      {conversationId ? (
        <>

          {/* Messages */}
          <div className="flex-1 overflow-hidden min-h-0">
            <MessageList conversationId={conversationId} />
          </div>

          {/* Input */}
          <div className="shrink-0">
            <MessageInput conversationId={conversationId} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Chọn cuộc trò chuyện</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn một cuộc trò chuyện từ danh sách để bắt đầu
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
