"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  onClick: () => void;
  className?: string;
}

export function ChatBubble({ onClick, className }: ChatBubbleProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
