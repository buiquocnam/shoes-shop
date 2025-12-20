"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatWindow } from "../shared/ChatWindow";
import { useCreateConversation } from "../../hooks";
import { useAuthStore } from "@/store";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const { mutate: createConversation } = useCreateConversation();
  const { user } = useAuthStore();

  // Get the first conversation or create one when modal opens
  useEffect(() => {
    if (!open || selectedConversationId || !user) return;
    createConversation(
      {
        participantId: user.id,
        participantName: user.name,
      },
      {
        onSuccess: (conversation) => {
          setSelectedConversationId(conversation.id);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full"
      >
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Hỗ trợ trò chuyện</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden min-h-0">
          <ChatWindow
            conversationId={selectedConversationId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
