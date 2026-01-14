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
                className={`max-w-[75%] rounded-xl p-3 text-sm ${
                    isOwn
                        ? "rounded-br-none bg-blue-600 text-white"
                        : "rounded-bl-none border border-white/10 bg-gray-800 text-gray-200"
                }`}
            >
                <div>{message.text}</div>
                <div
                    className={`mt-1 text-right text-[10px] ${isOwn ? "text-blue-200" : "text-gray-500"}`}
                >
                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            </div>
        </div>
    );
}
