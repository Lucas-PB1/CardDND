import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Message } from "@/services/chatService";
import { UserProfile } from "@/services/userService";

import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: UserProfile | null;
    messages: Message[];
    onSendMessage: (text: string) => void;
    currentUserId?: string;
    loading?: boolean;
}

export function ChatWindow({
    isOpen,
    onClose,
    recipient,
    messages,
    onSendMessage,
    currentUserId,
    loading,
}: ChatWindowProps) {
    const [newValue, setNewValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newValue.trim()) return;
        onSendMessage(newValue);
        setNewValue("");
    };

    if (!isOpen || !recipient) return null;

    return (
        <div className="fixed right-4 bottom-0 z-50 flex h-[500px] w-80 flex-col rounded-t-xl border border-white/10 bg-gray-900 shadow-2xl md:w-96">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-xl border-b border-white/10 bg-gray-800 p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                        {recipient.photoURL ? (
                            <Image
                                src={recipient.photoURL}
                                alt={recipient.displayName}
                                width={32}
                                height={32}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            recipient.displayName?.charAt(0).toUpperCase() || "?"
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">
                            {recipient.displayName}
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                        </span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 transition-colors hover:text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-950/50 p-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Loading chat...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500 italic">
                        Start the conversation with {recipient.displayName.split(" ")[0]}!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === currentUserId}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-white/10 bg-gray-800 p-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newValue.trim()}
                        className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
