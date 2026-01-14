import { UserProfile } from "@/services/userService";
import { Button } from "@/components/ui/Button";

interface UserCardProps {
    user: UserProfile;
    actionLabel: string;
    onAction: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    variant?: "default" | "request";
    loading?: boolean;
}

export function UserCard({ 
    user, 
    actionLabel, 
    onAction, 
    secondaryActionLabel,
    onSecondaryAction,
    variant = "default",
    loading = false 
}: UserCardProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user.displayName?.charAt(0).toUpperCase() || "?"
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-white">{user.displayName}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {secondaryActionLabel && onSecondaryAction && (
                    <Button 
                        onClick={onSecondaryAction} 
                        variant="secondary"
                        className="text-xs px-3 h-8"
                        disabled={loading}
                    >
                        {secondaryActionLabel}
                    </Button>
                )}
                <Button 
                    onClick={onAction} 
                    variant={variant === "request" ? "primary" : "secondary"}
                    className="text-xs px-3 h-8"
                    disabled={loading}
                >
                    {loading ? "..." : actionLabel}
                </Button>
            </div>
        </div>
    );
}
