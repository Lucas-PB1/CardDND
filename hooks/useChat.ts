import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    createConversation,
    sendMessage as sendMessageApi,
    subscribeToMessages,
    Message,
    Conversation
} from "@/services/chatService";

export function useChat() {
    const { user } = useAuth();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const unsubscribeRef = useRef<(() => void) | null>(null);

    const openChat = useCallback(async (otherUserId: string) => {
        if (!user) return;
        try {
            setIsLoading(true);
            const conversationId = await createConversation(user.uid, otherUserId);
            setActiveConversationId(conversationId);
            setIsOpen(true);
        } catch (error) {
            console.error("Failed to open chat", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setActiveConversationId(null);
        setMessages([]);
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!user || !activeConversationId) return;
        try {
            await sendMessageApi(activeConversationId, text, user.uid);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    }, [user, activeConversationId]);

    useEffect(() => {
        if (!activeConversationId) {
            setMessages([]);
            return;
        }

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        const unsubscribe = subscribeToMessages(activeConversationId, (newMessages) => {
            setMessages(newMessages);
        });

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [activeConversationId]);

    return {
        activeConversationId,
        messages,
        isLoading,
        isOpen,
        openChat,
        closeChat,
        sendMessage,
    };
}
