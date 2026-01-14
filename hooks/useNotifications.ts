import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    subscribeToNotifications,
    markAsRead as markAsReadApi,
    markAllAsRead as markAllAsReadApi,
    Notification
} from "@/services/notificationService";

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (notificationId: string) => {
        await markAsReadApi(notificationId);
    };

    const markAllAsRead = async () => {
        if (!user) return;
        await markAllAsReadApi(user.uid);
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    };
}
