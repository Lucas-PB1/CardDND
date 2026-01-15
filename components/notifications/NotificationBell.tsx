import { Bell } from "lucide-react";

import { useNotificationBell } from "@/hooks/useNotificationBell";

export function NotificationBell() {
    const {
        notifications,
        unreadCount,
        isOpen,
        dropdownRef,
        handleNotificationClick,
        handleMarkAllRead,
        toggleDropdown,
    } = useNotificationBell();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative rounded-full p-2 text-dnd-parchment transition-colors hover:text-white hover:bg-white/10 focus:outline-none ring-2 ring-dnd-gold/50 hover:ring-dnd-gold"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-dnd-red text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-dnd-card shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-border bg-muted/10 px-4 py-3">
                        <h3 className="text-sm font-semibold text-dnd-fg">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-blue-400 hover:text-blue-300"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`cursor-pointer border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/5 ${!notification.isRead ? "bg-blue-500/5" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p
                                                className={`text-sm ${!notification.isRead ? "font-medium text-dnd-fg" : "text-muted-foreground"}`}
                                            >
                                                {notification.title}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {notification.body}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-500">
                                        {notification.createdAt?.toDate
                                            ? notification.createdAt.toDate().toLocaleString()
                                            : "Just now"}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
