"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatWindow } from "../shared/ChatWindow";
import { useConversations, useCreateConversation } from "../../hooks";
import { useAuthStore } from "@/store";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const { data: messages } = useConversations();
  const { mutate: createConversation } = useCreateConversation();
  const { user } = useAuthStore();

  // Get the first conversation or create one when modal opens
  useEffect(() => {
    if (!open || selectedConversationId || !user) return;

    // If there are messages, use the first conversation
    if (messages && messages.length > 0) {
      // Group messages by conversationId and get the first one
      const conversationsMap = new Map<string, typeof messages[0]>();
      messages.forEach((msg) => {
        if (!conversationsMap.has(msg.conversationId)) {
          conversationsMap.set(msg.conversationId, msg);
        }
      });
      const firstConversation = Array.from(conversationsMap.values())[0];
      if (firstConversation) {
        setSelectedConversationId(firstConversation.conversationId);
      }
    } else {
      // Create new conversation if no messages exist
      createConversation(
        {
          senderId: user.id,
          senderName: user.name,
          participantId: user.id,
          participantName: user.name,
        },
        {
          onSuccess: (conversation) => {
            setSelectedConversationId(conversation.id);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col h-full"
      >
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle>Chat Support</SheetTitle>
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
