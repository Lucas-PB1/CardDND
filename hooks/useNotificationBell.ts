import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/services/notificationService";

export function useNotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        if (notification.type === "friend_request") {
            router.push("/social?tab=requests");
        }

        setIsOpen(false);
    };

    const handleMarkAllRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAllAsRead();
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    return {
        notifications,
        unreadCount,
        isOpen,
        dropdownRef,
        handleNotificationClick,
        handleMarkAllRead,
        toggleDropdown,
    };
}
