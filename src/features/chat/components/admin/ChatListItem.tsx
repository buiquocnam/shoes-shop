import { User, Clock } from "lucide-react";
import { useMessages } from "../../hooks";
import { cn } from "@/lib/utils";
import type { Conversation } from "../../types";
import { formatTimeAgo } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListItemProps {
    conversation: Conversation;
    isSelected: boolean;
    onSelect: (id: string, name: string) => void;
}

export function ChatListItem({
    conversation,
    isSelected,
    onSelect,
}: ChatListItemProps) {
    const { data: messages = [] } = useMessages(conversation.id);

    const latestMessage = messages.length > 0
        ? messages.reduce((prev, current) => {
            return new Date(prev.createdDate).getTime() > new Date(current.createdDate).getTime() ? prev : current;
        })
        : null;

    let displayName = conversation.conversationName;
    const customerMessage = messages.find((m) => !m.me);
    if (customerMessage) {
        displayName = customerMessage.senderName;
    } else if (latestMessage && latestMessage.me) {
        displayName = conversation.conversationName || "Khách hàng";
    }

    const previewMessage = latestMessage
        ? (latestMessage.me ? `Bạn: ${latestMessage.message}` : latestMessage.message)
        : "Chưa có tin nhắn";

    const timeAgo = latestMessage ? formatTimeAgo(latestMessage.createdDate) : formatTimeAgo(conversation.modifiedDate);

    return (
        <button
            onClick={() => onSelect(conversation.id, displayName)}
            className={cn(
                "flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b cursor-pointer group relative w-full",
                isSelected && "bg-primary/5"
            )}
            style={isSelected ? { borderLeft: "4px solid hsl(var(--primary))" } : undefined}
        >
            <div className="relative shrink-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={displayName} />
                    <AvatarFallback className={cn(isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                        <User className="h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
                {!latestMessage?.me && latestMessage && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-background"></div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div
                        className={cn("font-semibold truncate", isSelected && "text-primary")}
                    >
                        {displayName}
                    </div>
                    {timeAgo && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
                            <Clock className="h-3 w-3" />
                            <span>{timeAgo}</span>
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        "text-sm truncate",
                        isSelected ? "text-foreground/80" : "text-muted-foreground"
                    )}
                >
                    {previewMessage}
                </div>
            </div>
        </button>
    );
}
