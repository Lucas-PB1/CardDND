import { Message } from "@/services/chatService";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const timestamp = message.createdAt?.toDate ? message.createdAt.toDate() : new Date();

    return (
        <div className={`mb-3 flex w-full ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[75%] rounded-xl p-3 text-sm ${isOwn
                        ? "rounded-br-none bg-dnd-red text-white"
                        : "rounded-bl-none border border-border bg-dnd-card text-dnd-fg"
                    }`}
            >
                <div>{message.text}</div>
                <div
                    className={`mt-1 text-right text-[10px] ${isOwn ? "text-white/80" : "text-muted-foreground"}`}
                >
                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            </div>
        </div>
    );
}
