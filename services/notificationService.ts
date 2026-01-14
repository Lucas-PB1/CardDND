import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    updateDoc,
    doc,
    writeBatch,
    getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Notification {
    id: string;
    userId: string;
    type: "friend_request" | "friend_accepted" | "system";
    title: string;
    body: string;
    data?: any;
    isRead: boolean;
    createdAt: Timestamp;
}

const COLLECTION_NOTIFICATIONS = "notifications";

/**
 * Subscribes to notifications for a user.
 */
export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
        collection(db, COLLECTION_NOTIFICATIONS),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
        callback(notifications);
    });
}

/**
 * Marks a single notification as read.
 */
export async function markAsRead(notificationId: string) {
    const ref = doc(db, COLLECTION_NOTIFICATIONS, notificationId);
    await updateDoc(ref, {
        isRead: true
    });
}

/**
 * Marks all notifications as read for a user.
 */
export async function markAllAsRead(userId: string) {
    const q = query(
        collection(db, COLLECTION_NOTIFICATIONS),
        where("userId", "==", userId),
        where("isRead", "==", false)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
}
