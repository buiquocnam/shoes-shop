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
          {/* Header */}
          <div className="border-b bg-card px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-background rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {conversationName || "Khách hàng"}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Đang hoạt động
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Phản hồi trong vài phút
                </p>
              </div>
            </div>
          </div>

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
