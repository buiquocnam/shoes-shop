"use client";

import { useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatModal } from "./ChatModal";
import { useAuthStore } from "@/store";
import { Role } from "@/types/global";
import { useChatSocket } from "../../hooks/shared/useChatSocket";

export function ChatProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Setup socket connection (shared hook for both admin and user)
  useChatSocket();

  // UI guard
  if (!isAuthenticated || !user || user.role === Role.ADMIN) {
    return null;
  }

  return (
    <>
      <ChatBubble onClick={() => setIsOpen(true)} />
      <ChatModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}


