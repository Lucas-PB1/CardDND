import { useState, useRef, useEffect } from "react";
import { Message } from "@/services/chatService";
import { UserProfile } from "@/services/userService";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    loading 
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
        <div className="fixed bottom-0 right-4 w-80 md:w-96 bg-gray-900 border border-white/10 rounded-t-xl shadow-2xl flex flex-col z-50 h-[500px]">
            {/* Header */}
            <div className="p-3 bg-gray-800 rounded-t-xl border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {recipient.photoURL ? (
                            <img src={recipient.photoURL} alt={recipient.displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            recipient.displayName?.charAt(0).toUpperCase() || "?"
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">{recipient.displayName}</h4>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                        </span>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-950/50">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading chat...</div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm italic">
                        Start the conversation with {recipient.displayName.split(' ')[0]}!
                    </div>
                ) : (
                    messages.map(msg => (
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
            <form onSubmit={handleSubmit} className="p-3 bg-gray-800 border-t border-white/10">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button 
                        type="submit"
                        disabled={!newValue.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
