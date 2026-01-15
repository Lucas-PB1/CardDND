import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { Notification, notificationService } from "@/services/notificationService";

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    if (!user && (notifications.length > 0 || unreadCount > 0)) {
        setNotifications([]);
        setUnreadCount(0);
    }

    useEffect(() => {
        if (!user) return;

        const unsubscribe = notificationService.subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.isRead).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (notificationId: string) => {
        await notificationService.markAsRead(notificationId);
    };

    const markAllAsRead = async () => {
        if (!user) return;
        await notificationService.markAllAsRead(user.uid);
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
