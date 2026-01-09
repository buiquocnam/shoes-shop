"use client";

import { useState } from "react";
import { ChatBubble } from "@/features/chat/components/user/ChatBubble";
import { ChatModal } from "@/features/chat/components/user/ChatModal";
import { useAuthStore, useIsAuthenticated } from "@/store";
import { Role } from "@/types";

export function ChatProvider() {
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useAuthStore();
    const isAuthenticated = useIsAuthenticated();

    // Socket is now centrally managed by SocketProvider

    // UI guard
    if (!isAuthenticated || !user || user.role === "ADMIN") {
        return null;
    }

    return (
        <>
            <ChatBubble onClick={() => setIsOpen(true)} />
            <ChatModal open={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}
