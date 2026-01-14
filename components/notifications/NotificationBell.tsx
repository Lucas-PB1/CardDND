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
        toggleDropdown
    } = useNotificationBell();

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-gray-900 shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-800/50">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
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
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/5 ${
                                        !notification.isRead ? 'bg-blue-500/5' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <p className={`text-sm ${!notification.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notification.body}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">
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
