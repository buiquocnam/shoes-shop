"use client";

import { useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatModal } from "./ChatModal";
import { useAuthStore } from "@/store";
import { Role } from "@/types/global";

export function ChatProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Only show chat bubble for regular users (not admin)
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

