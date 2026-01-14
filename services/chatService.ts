import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    getDocs,
    updateDoc,
    doc,
    setDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
    readBy: string[];
}

export interface Conversation {
    id: string;
    participants: string[];
    lastMessage?: {
        text: string;
        senderId: string;
        createdAt: Timestamp;
        readBy?: string[];
    };
    updatedAt: Timestamp;
}

const COLLECTION_CONVERSATIONS = "conversations";
const COLLECTION_MESSAGES = "messages";

export class ChatService {
    /**
     * Creates or retrieves an existing conversation between participants.
     */
    async createConversation(currentUserId: string, otherUserId: string): Promise<string> {
        const q = query(
            collection(db, COLLECTION_CONVERSATIONS),
            where("participants", "array-contains", currentUserId)
        );

        const snapshot = await getDocs(q);
        const existing = snapshot.docs.find(doc => {
            const data = doc.data() as Conversation;
            return data.participants.includes(otherUserId) && data.participants.length === 2;
        });

        if (existing) {
            return existing.id;
        }

        const ref = doc(collection(db, COLLECTION_CONVERSATIONS));
        await setDoc(ref, {
            id: ref.id,
            participants: [currentUserId, otherUserId],
            updatedAt: serverTimestamp(),
        });

        return ref.id;
    }

    /**
     * Sends a message to a conversation.
     */
    async sendMessage(conversationId: string, text: string, senderId: string) {
        if (!text.trim()) return;

        const messagesRef = collection(db, COLLECTION_CONVERSATIONS, conversationId, COLLECTION_MESSAGES);
        const conversationRef = doc(db, COLLECTION_CONVERSATIONS, conversationId);

        const messageData = {
            text: text.trim(),
            senderId,
            createdAt: serverTimestamp(),
            readBy: [senderId]
        };

        await addDoc(messagesRef, messageData);

        await updateDoc(conversationRef, {
            lastMessage: messageData,
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Marks messages as read by user.
     */
    async markConversationAsRead(conversationId: string, userId: string) {
        const conversationRef = doc(db, COLLECTION_CONVERSATIONS, conversationId);

        await updateDoc(conversationRef, {
            "lastMessage.readBy": arrayUnion(userId)
        });
    }

    /**
     * Subscribes to the list of conversations for a user.
     */
    subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
        const q = query(
            collection(db, COLLECTION_CONVERSATIONS),
            where("participants", "array-contains", userId),
            orderBy("updatedAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Conversation));
            callback(conversations);
        });
    }

    /**
     * Subscribes to messages in a specific conversation.
     */
    subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
        const q = query(
            collection(db, COLLECTION_CONVERSATIONS, conversationId, COLLECTION_MESSAGES),
            orderBy("createdAt", "asc")
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            callback(messages);
        });
    }
}

export const chatService = new ChatService();

