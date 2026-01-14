import { Message } from "@/services/chatService";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const timestamp = message.createdAt?.toDate ? message.createdAt.toDate() : new Date();

    return (
        <div className={`flex w-full mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
            <div 
                className={`max-w-[75%] p-3 rounded-xl text-sm ${
                    isOwn 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-gray-800 text-gray-200 rounded-bl-none border border-white/10"
                }`}
            >
                <div>{message.text}</div>
                <div className={`text-[10px] mt-1 text-right ${isOwn ? "text-blue-200" : "text-gray-500"}`}>
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
